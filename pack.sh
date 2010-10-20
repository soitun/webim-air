#!/bin/sh

#http://help.adobe.com/en_US/air/build/WS5b3ccc516d4fbf351e63e3d118666ade46-7ecc.html
# Packaging an AIR application in a native installer http://help.adobe.com/en_US/air/build/WS789ea67d3e73a8b22388411123785d839c-8000.html

#adt -certificate -cn nextim 1024-RSA cert.pfx pass

adt -package -storetype pkcs12 -keystore cert.pfx nexim.air application.xml air.html air.window.html custom.js updater.js static updateConfig.xml LICENSE.txt
