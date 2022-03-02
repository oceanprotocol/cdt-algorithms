<!--
Copyright 2022 Ocean Protocol Foundation
SPDX-License-Identifier: Apache-2.0
-->
# Iris and Logistic Regression

This directory contains the [Iris Dataset][1] downloaded from [OpenML][2] and
a python script for training a Logistic Regression Classifier based on [this tutorial from Scikit Learn][3].

[1]: https://en.wikipedia.org/wiki/Iris_flower_data_set
[2]: https://www.openml.org/d/61
[3]: https://scikit-learn.org/stable/auto_examples/linear_model/plot_iris_logistic.html

### Requirements

- Python 3.8.5+

### Installation

```console
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

To train the logistic regression classifier using the `dataset_61_iris.csv`,
follow these steps. The model will be saved in `logistic_regression.pickle`.

```console
python logistic_regression.py local
```

Unpickling the result, in a Python console or script:

```console
pickle.load(open("logistic_regression.pickle", "rb"))
```

The OCEAN compute-to-data backend would run this algorithm as shown below. It
assumes "DIDS" is set as an environment variable, input is found at `/data/ddos`,
and output is sent to `/data/outputs/result`:

```console
python logistic_regression.py
```
