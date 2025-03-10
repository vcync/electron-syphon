#import <AppKit/AppKit.h>
#import <Metal/Metal.h>
#import <QuartzCore/QuartzCore.h>
#include <Syphon/Syphon.h>
#include <napi.h>

// Metal objects
id<MTLDevice> metalDevice = nil;
id<MTLCommandQueue> commandQueue = nil;
SyphonMetalServer *syphonServer = nil;
id<MTLTexture> metalTexture = nil;
CAMetalLayer *metalLayer = nil;
int currentWidth = 0;
int currentHeight = 0;

void InitSyphon() {
  metalDevice = MTLCreateSystemDefaultDevice();
  if (!metalDevice) {
    NSLog(@"Failed to create Metal device");
    return;
  }

  commandQueue = [metalDevice newCommandQueue];

  syphonServer = [[SyphonMetalServer alloc] initWithName:@"SyphonMetalTexture"
                                                  device:metalDevice
                                                 options:nil];

  // Setup CAMetalLayer for rendering
  metalLayer = [CAMetalLayer layer];
  metalLayer.device = metalDevice;
  metalLayer.pixelFormat = MTLPixelFormatBGRA8Unorm;
  metalLayer.maximumDrawableCount = 2;
  metalLayer.contentsScale = [NSScreen mainScreen].backingScaleFactor;

  metalLayer.drawableSize = CGSizeMake(1920, 1080);
}

void CreateOrResizeTexture(int width, int height) {
  // Only recreate the texture if the dimensions have changed
  if (metalTexture && width == currentWidth && height == currentHeight) {
    return; // No need to recreate
  }

  // Update stored dimensions
  currentWidth = width;
  currentHeight = height;

  // Define texture descriptor
  MTLTextureDescriptor *textureDescriptor = [[MTLTextureDescriptor alloc] init];
  textureDescriptor.pixelFormat = MTLPixelFormatRGBA8Unorm;
  textureDescriptor.width = width;
  textureDescriptor.height = height;
  textureDescriptor.usage =
      MTLTextureUsageShaderRead | MTLTextureUsageShaderWrite;
  textureDescriptor.storageMode = MTLStorageModeShared;

  // Create Metal texture
  metalTexture = [metalDevice newTextureWithDescriptor:textureDescriptor];
}

void PublishSyphonFrame(const Napi::CallbackInfo &info) {

  // Extract arguments (pixels, width, height)
  unsigned char *pixels =
      (unsigned char *)info[0].As<Napi::Buffer<unsigned char>>().Data();
  int width = info[1].As<Napi::Number>().Int32Value();
  int height = info[2].As<Napi::Number>().Int32Value();

  if (!syphonServer) {
    InitSyphon();
  }

  // Ensure Metal device and command queue exist
  if (!metalDevice || !commandQueue) {
    NSLog(@"Metal device or command queue not initialized!");
    return;
  }

  // Acquire a command buffer
  id<MTLCommandBuffer> commandBuffer = [commandQueue commandBuffer];

  // Create a new Metal texture if it doesn’t exist
  if (!metalTexture || width != currentWidth || height != currentHeight) {
    currentWidth = width;
    currentHeight = height;

    MTLTextureDescriptor *textureDescriptor =
        [[MTLTextureDescriptor alloc] init];
    textureDescriptor.pixelFormat = MTLPixelFormatBGRA8Unorm;
    textureDescriptor.width = width;
    textureDescriptor.height = height;
    textureDescriptor.usage =
        MTLTextureUsageShaderRead | MTLTextureUsageShaderWrite;

    metalTexture = [metalDevice newTextureWithDescriptor:textureDescriptor];
  }

  // Copy pixel data to Metal texture
  MTLRegion region = MTLRegionMake2D(0, 0, width, height);
  [metalTexture replaceRegion:region
                  mipmapLevel:0
                    withBytes:pixels
                  bytesPerRow:width * 4];

  // Publish the texture using Syphon
  [syphonServer publishFrameTexture:metalTexture
                    onCommandBuffer:commandBuffer
                        imageRegion:NSMakeRect(0, 0, width, height)
                            flipped:YES];

  // Commit command buffer
  [commandBuffer commit];
}

// Wrap the native function for Node.js
Napi::Value PublishSyphonFrameWrapped(const Napi::CallbackInfo &info) {
  PublishSyphonFrame(info);
  return info.Env().Undefined();
}

// Export the module to Node.js
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("publishSyphonFrame",
              Napi::Function::New(env, PublishSyphonFrameWrapped));
  return exports;
}

NODE_API_MODULE(syphon, Init);
