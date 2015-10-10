App.info({
  id: 'me.dispatch',
  name: 'Dispatch Maps',
  description: 'General map package for both browser and cordova',
  author: 'Dispatch Team',
  email: 'support@dispatch.me',
  website: 'http://github.com/DispatchMe/meteor-maps',
  version: '0.0.1'
});

App.configurePlugin('plugin.google.maps', {
  API_KEY_FOR_ANDROID: 'AIzaSyDiuuR0vOvm0EwWg6qIjundGFLARcGUu5k',
  API_KEY_FOR_IOS: 'AIzaSyBIEtAm02RN5KDIuNT-YGB3-XT_zHjVSqU'
});
