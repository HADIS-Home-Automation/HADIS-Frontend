# src

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Build and Run project in Docker
```
docker build -t --build-arg VUE_APP_SERVER="SERVER IP" hadis-webapp .
docker run -d -p 5000:8080 --name hadis hadis-webapp
```

## Customize application
HADIS frontend is built dynamically from a JSON configuration file - [configJSON](src/configJSON.json). Sample configuration is provided in the config file.

ConfigJSON form displayed bellow.
Each **groupRoute** & **deviceName** must be unique! 
**deviceName** is limited to 40 characters (only ASCII guaranteed to work).

```JSON
{
"groups": [
    {
      "groupRoute": "route for page",
      "groupNameDISPLAY": "group name that will be displayed",
      "components": [
        {
          "deviceName": "name of device for HADIS MQTT topic",
          "deviceNameDISPLAY": "device name that will be displayed",
          "componentType": "type of component (see available bellow)"
        }
      ]
    }
  ]
}
```

### Available components

#### Dimmable Light
Control component for HADIS dimmable LED light controller.
```
componentType: "DimmableLight"
```

#### WIFI Switch
Control component for HADIS WIFI switch.
```
componentType: "WifiSwitch"
```

#### Switch Board for WIFI Switches
Component for controlling multiple HADIS WIFI switches.
Append different wifi switches or plugs to switchboard in switches array
To use multiple channel switches replace **deviceNameDISPLAY** with **deviceNameDISPLAYn** for each channel and add **channel** field with number of channels.

**Currently only 2 channel support**
```
deviceNameDISPLAY1: display name of first channel
deviceNameDISPLAY2: display name of second channel
deviceNameDISPLAYn: display name of n-th channel
channel: number of channels
```

See usage example bellow.
```
componentType: "SwitchBoard"
switches: [array of devices in switch board]
```

example usage:
```JSON
{
    "deviceName": "NOT REQUIRED FOR THIS COMPONENT",
    "deviceNameDISPLAY": "SwitchBoard",
    "componentType": "SwitchBoard",
    "switches": [
          {
            "deviceName": "WifiSwitch1",
            "deviceNameDISPLAY": "Switch 1"
          },
          {
            "deviceName": "WifiSwitch2",
            "deviceNameDISPLAY": "Switch 2"
          },
          {
            "deviceName": "WifiSwitch3",
            "deviceNameDISPLAY1": "Switch 3 - 1",
            "deviceNameDISPLAY2": "Switch 3 - 2",
            "channel": 2
          }
    ]
}
```

#### RGBW Controller
Control component for HADIS RGBW controller.\
Mode supports all permutations of rgw & rgbw to support different kinds of led strips.\
Presets are rgb hex values for quick color selection. Number of presets is not limited.

```
componentType: "RGBW-Controller"
mode: "rgb / rgbw"
pressets: [array of hex rgb value]
```

example usage:
```JSON
{
    "deviceName": "RGBWstrip2",
    "deviceNameDISPLAY": "RGBW Strip",
    "componentType": "RGBW-Controller",
    "mode" : "brgw",
    "presets": [
            {
              "color": "#FF0000"
            },
            {
              "color": "#00FF00"
            },
            {
              "color": "#0000FF"
            },
            {
              "color": "#FFFFFF"
            }
    ]
}
```

#### Temperature & Humidity sensor
Display component for HADIS temperature & humidity sensor.
Update interval is 1 min, for inside use only.

```
componentType: "TempHumSensor"
```
