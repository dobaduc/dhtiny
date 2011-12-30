#!/bin/bash
cp -f temp/Menu-mine.txt temp/Menu.txt
perl naturaldocs/NaturalDocs -i dhtiny -o FramedHTML ../doc -p temp -ro -hl all -do -nag
rm -f temp/Menu_Backup*