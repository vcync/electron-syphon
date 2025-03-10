{
  "targets": [
    {
      "target_name": "syphon",
      "sources": ["native/syphon/syphon.mm"],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")",
        "node_modules/node-addon-api",
        "/System/Library/Frameworks/OpenGL.framework/Headers"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "xcode_settings": {
        "OTHER_LDFLAGS": [
          "-framework OpenGL",
          "-framework AppKit",
          "-framework Cocoa",
        ],
        "OTHER_CFLAGS": [
          "-F/Library/Frameworks"
        ]
      },
      "libraries": [
        "/Library/Frameworks/Syphon.framework/Syphon"
      ]
    }
  ]
}
