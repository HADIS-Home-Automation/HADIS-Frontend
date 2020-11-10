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

### Lints and fixes files
```
npm run lint
```

## Customize application
HADIS frontend is built dynamically from [configJSON](src/configJSON.json).

ConfigJSON form displayed bellow.
Each **groupRoute** & **deviceName** must be unique! 
**deviceName** is limited to 40 characters (ASCII guaranteed to work).

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
