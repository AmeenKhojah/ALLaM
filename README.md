Setup Node environment 
 install node version 20 or greater

Setup Angular CLI

npm install -g @angular/cli

//Setup Ionic 

npm install -g @ionic/cli
(ng v)
//Remove packagelock.json
//Click terminal
npm install --force (inside terminal)
ionic serve

Following Steps to create apk file

1.first run command 'ionic build'
2.after creating build run command 'npm install @capacitor/assets --save-dev'
3.after adding capacitor, run command 'npx capacitor-assets generate'
4.to add android platform run command 'ionic cap add android'
5.after adding android on capacitor to make it running on android run command 'ionic cap open android'
6.open project in android studio go into build menu select Build/app Bundle(s)/APK(s) and click on Build APK

![alt text](image.png)

7- after making any chnage into a project before to rebuild have to sync with this command 'ionic cap sync'
