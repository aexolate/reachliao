export default {
    "expo": {
      "name": "reachliao",
      "slug": "reachliao",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "splash": {
        "image": "./assets/splash2.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "updates": {
        "fallbackToCacheTimeout": 0
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#FFFFFF"
        },
        "package": "com.reachliao",
        "config": {
          "googleMaps": {
            "apiKey": process.env.GOOGLE_MAPS_API_KEY
          }
        }
      },
      "web": {
        "favicon": "./assets/favicon.png"
      }
    }
  }
  