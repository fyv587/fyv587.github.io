#!/bin/zsh
cd -- "${0:A:h}" || exit 1
printf 'Homepage preview: http://127.0.0.1:4001/\nKeep this window open while viewing. Press Control+C to stop.\n'
python3 _preview/serve.py
printf '\nPreview stopped. Press Return to close.\n'
read
