#http://help.adobe.com/en_US/air/build/WS5b3ccc516d4fbf351e63e3d118666ade46-7ecc.html
# Packaging an AIR application in a native installer http://help.adobe.com/en_US/air/build/WS789ea67d3e73a8b22388411123785d839c-8000.html

PREFIX = .

PARAM = -package -storetype pkcs12 -keystore cert.pfx

FILES = ${PREFIX}/application.xml\
	${PREFIX}/air.html\
	${PREFIX}/static\
	${PREFIX}/air.window.html\
	${PREFIX}/custom.js\
	${PREFIX}/updater.js\
	${PREFIX}/updateConfig.xml\
	${PREFIX}/LICENSE.txt

CERT_FILE = ${PREFIX}/cert.pfx
AIR_FILE = ${PREFIX}/nextim.air
DMG_FILE = ${PREFIX}/nextim.dmg
EXE_FILE = ${PREFIX}/nextim.exe
DEB_FILE = ${PREFIX}/nextim.deb

all: air dmg exe deb

air: ${AIR_FILE}

dmg: ${DMG_FILE}

exe: ${EXE_FILE}

deb: ${DEB_FILE}

${AIR_FILE}: ${CERT_FILE}
	@@adt  ${PARAM} ${AIR_FILE} ${FILES}
	@@echo "Build ${AIR_FILE} complete."

${DMG_FILE}: ${AIR_FILE}
	@@adt  -package -target native ${DMG_FILE} ${AIR_FILE}
	@@echo "Build ${DMG_FILE} complete."

${EXE_FILE}: ${AIR_FILE}
	@@adt  -package -target native ${EXE_FILE} ${AIR_FILE}
	@@echo "Build ${EXE_FILE} complete."

${DEB_FILE}: ${AIR_FILE}
	@@adt  -package -target native ${DEB_FILE} ${AIR_FILE}
	@@echo "Build ${DEB_FILE} complete."

${CERT_FILE}:
	@@adt -certificate -cn nextim 1024-RSA ${CERT_FILE} hidden

clean:
	@@rm -rf ${AIR_FILE} ${DMG_FILE} ${EXE_FILE} ${DEB_FILE}
	@@echo "Remove ${AIR_FILE} ${DMG_FILE} ${EXE_FILE} ${DEB_FILE} complete."


