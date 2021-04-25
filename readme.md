# Forced Audio Alignment

## Installation

### Source

- Install [Kaldi](https://www.eleanorchodroff.com/tutorial/kaldi/installation.html).
- Setup `KALDI_ROOT` in `path.sh`.
- Install [SLIRM](https://hovinh.github.io/blog/2016-04-22-install-srilm-ubuntu/) and ensure SLIRM binaries are in `PATH`.
- Download and build Kaldi Pretrained model using `build_model.sh`. This repo currently relies on Aspire Chain model. You can accordingly replace the model from [here](https://kaldi-asr.org/models.html) in `build_model.sh`.
- Install Python Dependencies using `requirements.txt`.
- Make the directories for storage.
  ```
  mkdir -p s3/text s3/audio s3/faligned
  ```
- Run the python server using `python server.py`

### Docker

---

## Usage

- The server runs on port `5000` by default. _(Remember to bind it when using docker.)_
- Navigate to http://localhost:5000 to view the html form.
- Enter the quiz bowl text as well as the audio file and click on upload.
- Also add a unique id to reference this question.
- Upon successful response, enter the same id in the play audio input box and click on play. The text would appear as the audio is being spoken.
- You can check out the `id.vtt` files generated for every audio as a universal `vtt` format subtitle file for easy usage.
- Unknown words would appear as [noise].

---

## Personal Notes

### Qanta & QB-Interface

- I was able to get qanta up and running as was able to fix some issues in the way. (See )

- I achieved an accuracy of ~47% on DAN classifier. I have attached a notebook in qanta folder as a example installation of qanta.

- I tried intergrating with the interface, but I ran into several issues _(also due to abscence of a readme)_ while running the qb_interface, some were :

- The work here is modular i.e. additional 3 routes for a web server and the frontend is built using ReactJS so there's only need to import additional scripts and add a `<div>` tag for react render. So I beleive it could be easily integrated into qb_interface.
