<!--
Copyright 2022 Ocean Protocol Foundation
SPDX-License-Identifier: Apache-2.0
-->
# Peppers and Grayscale

This directory contains the [Peppers test image][1] and a Grayscale algorithm using
the [Pillow][2] image processing library.

[1]: https://sipi.usc.edu/database/database.php?volume=misc&image=13#top
[2]: https://pillow.readthedocs.io/en/stable/handbook/overview.html

### Requirements

- Python 3.8.5+

### Installation

```
#set up virtualenv
python -m venv venv
source venv/bin/activate

#install virtualenv dependencies
pip install wheel
pip install -r requirements.txt
```

### Usage

To run the grayscale algorithm on the `peppers.tiff` image, follow these steps.
The grayscale image will be saved in `grayscale.png`.

```console
python grayscale.py local
```

The OCEAN compute-to-data backend would run this algorithm as shown below. It
assumes "DIDS" is set as an environment variable, input is found at `/data/ddos`,
and output is sent to `/data/outputs/result`:

```console
python grayscale.py
```
