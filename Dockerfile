FROM ubuntu:latest
RUN apt update
RUN apt install -y git
RUN apt-get install -y g++ make automake autoconf unzip wget sox gfortran libtool subversion python2.7 python3
RUN git clone https://github.com/kaldi-asr/kaldi.git kaldi --origin upstream
RUN apt install -y zlib1g-dev
RUN cd kaldi/tools && \
    extras/check_dependencies.sh && \
    make || true
RUN echo "Dependencies Checked!"