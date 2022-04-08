#!/usr/bin/env python

# IMPORT

from __future__ import print_function
import sys
import os
import time
from abc import abstractmethod

from blue_st_sdk.manager import Manager
from blue_st_sdk.manager import ManagerListener
from blue_st_sdk.node import NodeListener
from blue_st_sdk.feature import FeatureListener
from blue_st_sdk.features.audio.adpcm.feature_audio_adpcm import FeatureAudioADPCM
from blue_st_sdk.features.audio.adpcm.feature_audio_adpcm_sync import FeatureAudioADPCMSync

from protocol import ProtocolGenerator
from websocket import create_connection

# CONSTANTS

# Presentation message.
INTRO = """##################
# BlueST Example #
##################"""

# Bluetooth Scanning time in seconds (optional).
SCANNING_TIME_s = 5

# Number of notifications to get before disabling them.
NOTIFICATIONS = 1000

til = "BCN-423"
prx = 6
ws = create_connection("ws://localhost:8000")


# FUNCTIONS

#
# Printing intro.
#
def print_intro():
    print('\n' + INTRO + '\n')


# INTERFACES

#
# Implementation of the interface used by the Manager class to notify that a new
# node has been discovered or that the scanning starts/stops.
#
class MyManagerListener(ManagerListener):

    #
    # This method is called whenever a discovery process starts or stops.
    #
    # @param manager Manager instance that starts/stops the process.
    # @param enabled True if a new discovery starts, False otherwise.
    #
    def on_discovery_change(self, manager, enabled):
        print('Discovery %s.' % ('started' if enabled else 'stopped'))
        if not enabled:
            print()

    #
    # This method is called whenever a new node is discovered.
    #
    # @param manager Manager instance that discovers the node.
    # @param node    New node discovered.
    #
    def on_node_discovered(self, manager, node):
        print('New device discovered: %s.' % (node.get_name()))


#
# Implementation of the interface used by the Node class to notify that a node
# has updated its status.
#
class MyNodeListener(NodeListener):

    #
    # To be called whenever a node connects to a host.
    #
    # @param node Node that has connected to a host.
    #
    def on_connect(self, node):
        print('Device %s connected.' % (node.get_name()))

    #
    # To be called whenever a node disconnects from a host.
    #
    # @param node       Node that has disconnected from a host.
    # @param unexpected True if the disconnection is unexpected, False otherwise
    #                   (called by the user).
    #
    def on_disconnect(self, node, unexpected=False):
        print('Device %s disconnected%s.' % \
            (node.get_name(), ' unexpectedly' if unexpected else ''))
        if unexpected:
            # Exiting.
            print('\nExiting...\n')
            sys.exit(0)


#
# Implementation of the interface used by the Feature class to notify that a
# feature has updated its data.
#
class MyFeatureListener(FeatureListener):

    _notifications = 0
    """Counting notifications to print only the desired ones."""

    #
    # To be called whenever the feature updates its data.
    #
    # @param feature Feature that has updated.
    # @param sample  Data extracted from the feature.
    #
    def on_update(self, feature, sample):
        if self._notifications < NOTIFICATIONS:
            self._notifications += 1

            data = sample.get_data()
            dataToSend = ProtocolGenerator("/switch", str(data))
            ws.send(dataToSend.create())


# MAIN APPLICATION

#
# Main application.
#
def main(argv):

    # Printing intro.
    print_intro()

    try:
        # Creating Bluetooth Manager.
        manager = Manager.instance()
        manager_listener = MyManagerListener()
        manager.add_listener(manager_listener)

        while True:
            # Synchronous discovery of Bluetooth devices.
            print('Scanning Bluetooth devices...\n')
            manager.discover(SCANNING_TIME_s)

            # Getting discovered devices.
            discovered_devices = manager.get_nodes()

            # Listing discovered devices.
            if not discovered_devices:
                print('No Bluetooth devices found. Exiting...\n')
                sys.exit(0)
            print('Available Bluetooth devices:')
            i = 1
            necklace = 0
            for device in discovered_devices:
                if device.get_name() == til:
                    necklace += i
                    print("LALALALAL")
                print('%d) %s: [%s]' % (i, device.get_name(), device.get_tag()))
                i += 1

            print("Necklace", necklace)

            device = discovered_devices[necklace - 1]
            node_listener = MyNodeListener()
            device.add_listener(node_listener)

            # Connecting to the device.
            print('Connecting to %s...' % (device.get_name()))
            if not device.connect():
                print('Connection failed.\n')
                continue

            while True:
                # Getting features.
                features = device.get_features()
                
                feature = features[prx - 1]

                # Enabling notifications.
                feature_listener = MyFeatureListener()
                feature.add_listener(feature_listener)
                device.enable_notifications(feature)

                # Getting notifications.
                notifications = 0
                while notifications < NOTIFICATIONS:
                    if device.wait_for_notifications(0.05):
                        notifications += 1

                # Disabling notifications.
                device.disable_notifications(feature)
                feature.remove_listener(feature_listener)
                

    except KeyboardInterrupt:
        try:
            # Exiting.
            print('\nExiting...\n')
            sys.exit(0)
        except SystemExit:
            os._exit(0)


if __name__ == "__main__":

    main(sys.argv[1:])
