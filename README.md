# Technologies 
* Ionic
* Angular
* Typescript
* NodeJs
* Firebase

# Tools
* Visual Studio Code
* Android Studio

# Setup Development Environment

* **Node js**
  install node version 20.18 or greater https://nodejs.org/en/download/prebuilt-installer
  after instalation check it's verion to make sure it is properly installed
  <pre> node -v </pre>
  
* **Angular Cli**
  run folloing command to install angular cli
  <pre>npm install -g @angular/cli@18.0.5</pre>
  check it's version after instalation
   <pre>ng --version</pre>
  
* **Ionic**
  run following command to install ionic cli
  <pre>npm install -g @ionic/cli@7.2.0</pre>
  check it's version after instalation
  <pre>ionic --version</pre>

# To make it Run locally
* install folloing command to its app all dependiencies
  <pre>npm install</pre>
* To serve locall use following command
  <pre>npm run ion-serve</pre>

# Build for Andoid 
*  first build applicaion with folling command
    <pre>npm run ion-build</pre>
* now sync and add andoid platform by running followng command
    <pre>npm run ion-andoid</pre>
* now open this project into android studio by following command
    <pre>ionic cap open android</pre>
    
# Genrate APK using Android Studio 
  open project in android studio go into build menu select Build/app Bundle(s)/APK(s) and click on Build APK
 **Note** 
after any changes into your app you have to sync your code for your platforms by running this command other wise your changes will not reflect
<pre>ionic cap sync</pre>

# Setup Firebase and deploy firebase cloud functions
* open terminal windoe at path cloud-functions/function, Install all dependiences here by following command
  <pre>npm install</pre>
* install firebase tools by running this command
  <pre>npm install -g @fireabase-tools</pre>
* after instalation deploy firebase cloud fucntion by following these command one by one
  * <pre>firebase login</pre>
  * <pre>firebase init</pre>
  * <pre>npm run deploy</pre>
  
