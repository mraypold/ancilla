# Ancilla

## Overview

This repository contains a very thin wrapper around Tensorflow Serving and a pre-trained object detection model (Inception), in an attempt to develop something of a comparible developer UX to [machinebox](https://machinebox.io/), but with better performance. I'm still a ways off.

The HTTP service runs on node.js with Koa.

Internal RPC calls are made with gRPC. Instead of extracting the Tensorflow Serving proto files at build time so that they can be version locked, I've taken the step of manually copying them to the repository, which I suspect is not best practice, but this is a first using gRPC for me. Copying them over was simpler.

As gRPC still does not have a fully implemented library for node.js written in pure javascript, we have to deal with node gyp.

## Installation

`make install` will download an Inception model [hosted by AWS](https://docs.aws.amazon.com/dlami/latest/devguide/tutorial-tfserving.html) and install the node dependencies.

The node dependencies are installed within a `node:11` docker container to make working with node gyp a bit easier when using docker-compose volume mounts.

If you intend to run the node app outside of docker, a `.nvmrc` file has been included. Simply run `nvm use` and then `npm install`. You will have to manually configure the environment variables in your shell. See the docker-compose file for more details.

Once everything is installed, run `docker-compose up`.

You can clean up the repository by calling `make clean`.

## Usage

To call the API, you must submit an application/json POST request to `localhost:3000` containing an `image` field with a fully qualified domain pointing to an image.

eg request:
```bash
curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"image":"https://www.tensorflow.org/images/cropped_panda.jpg"}' http://localhost:3000
```

eg respones:
```json
{
    "image": "https://www.tensorflow.org/images/cropped_panda.jpg",
    "predictions": [
        {
            "classes": [
                "giant panda",
                "panda",
                "panda bear",
                "coon bear",
                "Ailuropoda melanoleuca"
            ],
            "confidence": 0.9391326957630904
        },
        {
            "classes": [
                "indri",
                "indris",
                "Indri indri",
                "Indri brevicaudatus"
            ],
            "confidence": 0.050624059267770034
        },
        {
            "classes": [
                "gibbon",
                "Hylobates lar"
            ],
            "confidence": 0.005096236261517116
        },
        {
            "classes": [
                "lesser panda",
                "red panda",
                "panda",
                "bear cat",
                "cat bear",
                "Ailurus fulgens"
            ],
            "confidence": 0.004025831917065287
        },
        {
            "classes": [
                "titi",
                "titi monkey"
            ],
            "confidence": 0.0011211767905570814
        }
    ]
}
```

Tensorflow Serving uses POST instead of GET to make predictions and I didn't want to stray too far from the existing conventions. Otherwise, I am considering switching to GET requests and layering some sort of cache in front of each request.

## Tests

No tests exist at this time. This system isn't intended to be used in production or be backwards compatible between releases.

## Future Extensions

- Instead of using a model hosted by AWS, manually export an inception model.
- Switching from POST to GET requests.
- Caching object detection results or perhaps gRPC calls.
- Build scripts to compile docker images for deployment.

## Some Thoughts

- Koa is really nice.
- I'm not yet sold on the benefits of gRPC. The better performance has not compensated for the learning curve or added complexity. However, if I was using this in production or a large scale project, where the type hinting and performacne was preferred, this opinion would likely be very different. It does seem nice in principle.
- The Tensorflow Serving documentation makes too many assumptions about existing knowledge of gRPC.
- The pre-trained Inception model is fairly barebones. Exhaustive transfer learning will be needed to make it more useful in production.
