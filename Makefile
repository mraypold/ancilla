
.PHONY: download_inception
download_inception:
	curl -O https://s3-us-west-2.amazonaws.com/aws-tf-serving-ei-example/inception.zip
	unzip inception.zip -d models
	rm -rf https://s3-us-west-2.amazonaws.com/aws-tf-serving-ei-example/inception.zip


.PHONY: install_api_dependencies
install_api_dependencies:
	docker run --rm -v ${PWD}:/app -w=/app node:11 npm install

.PHONY: install
install: download_inception install_api_dependencies
	echo "Installation complete"

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf models/*
