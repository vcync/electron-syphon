{
  "targets": [
    {
      "target_name": "syphon",
      "sources": ["native/syphon/syphon.mm"],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")",
        "node_modules/node-addon-api",
      ],
      "link_settings": {
        "libraries": [
          "/Library/Frameworks/Syphon.framework/Syphon"
        ],
        "ldflags": [
          "-rpath", "@loader_path/../Frameworks"
        ]
      },
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "xcode_settings": {
        "OTHER_CFLAGS": [
          "-F/Library/Frameworks"
        ],
        "LD_RUNPATH_SEARCH_PATHS": [
          "@loader_path/../Frameworks",
          "@executable_path/../Frameworks",
          "/Library/Frameworks"
        ]
      },
      "libraries": [
        "/Library/Frameworks/Syphon.framework/Syphon"
      ]
    }
  ]
}
