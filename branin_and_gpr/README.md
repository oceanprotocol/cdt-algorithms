<!--
Copyright 2022 Ocean Protocol Foundation
SPDX-License-Identifier: Apache-2.0
-->
# Branin and GPR (Gaussian Process Regressor)

Create the [branin dataset][1] in ARFF format. Train a [Gaussian Process Regressor][2] on it.

[1]: https://statisticaloddsandends.wordpress.com/2019/06/24/test-functions-for-optimization-and-the-branin-hoo-function/
[2]: https://scikit-learn.org/stable/modules/gaussian_process.html#gaussian-process

### Requirements

- Python 3.8.5+

### Installation
```

#install non-virtualenv dependencies
sudo apt-get install python3-tk

#set up virtualenv
python -m venv venv
source venv/bin/activate

#install virtualenv dependencies
pip install wheel
pip install -r requirements.txt
```

### Usage
To create the branin datasest:

```console
python branin.py
```

To train the GPR classifier locally using the data saved in `branin.arff`,
follow these steps. The model will be saved in `gpr.pickle`.

```console
python gpr.py local
```

Unpickling the result, in a Python console or script:

```console
pickle.load(open("gpr.pickle", "rb"))
```

The OCEAN compute-to-data backend would run this algorithm as shown below. It
assumes "DIDS" is set as an environment variable, input is found at `/data/ddos`,
and output is sent to `/data/outputs/result`:

```console
python gpr.py
```

### ARFF
[branin.arff](branin.arff)

### Plot

![Image of branin](branin.png)
