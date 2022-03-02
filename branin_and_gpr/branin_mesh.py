#
# Copyright 2022 Ocean Protocol Foundation
# SPDX-License-Identifier: Apache-2.0
#
import numpy


def branin_mesh(X0, X1):
    # b,c,t = 5.1/(4.*(pi)**2), 5./pi, 1./(8.*pi)
    b, c, t = 0.12918450914398066, 1.5915494309189535, 0.039788735772973836
    u = X1 - b * X0**2 + c * X0 - 6
    r = 10.0 * (1.0 - t) * numpy.cos(X0) + 10
    Z = u**2 + r

    return Z


def create_mesh(npoints):
    X0_vec = numpy.linspace(-5.0, 10.0, npoints)
    X1_vec = numpy.linspace(0.0, 15.0, npoints)
    X0, X1 = numpy.meshgrid(X0_vec, X1_vec)
    Z = branin_mesh(X0, X1)

    return X0, X1, Z
