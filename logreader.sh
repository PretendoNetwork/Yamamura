#!/bin/bash
oldsum="$(md5sum output.log)"
clear
echo "Yamamura chat log:"
echo "----------------------------"
tail -n 20 output.log
while [[ True ]]; do
	newsum="$(md5sum output.log)"
	if [[ "$oldsum" != "$newsum" ]]; then
		clear
		echo "Yamamura chat log:"
		echo "----------------------------"
		tail -n 20 output.log
		oldsum="$newsum"
	fi
	sleep 2
done
