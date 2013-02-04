build: components lib
	@rm -rf dist
	@mkdir dist
	@coffee -o dist -c lib/main.coffee lib/Client.coffee lib/Namespace.coffee
	@component build --standalone Vein
	@mv build/build.js vein.js
	@rm -rf build
	@node_modules/.bin/uglifyjs -nc --unsafe -mt -o vein.min.js vein.js
	@echo "File size (minified): " && cat vein.min.js | wc -c
	@echo "File size (gzipped): " && cat vein.min.js | gzip -9f  | wc -c
	@cp vein.js examples/add/vein.js

components: component.json
	@component install --dev

clean:
	rm -fr components