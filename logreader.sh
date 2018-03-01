#!/bin/bash
while [[ True ]]; do
	clear
	echo "Pretendo Discord log:"
	echo "---------------------------"
	tail -n 20 output.log
	sleep 5
done
