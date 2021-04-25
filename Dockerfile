FROM ubuntu:latest
WORKDIR /home
RUN apt update
RUN apt install -y git
RUN apt-get install -y g++ make automake autoconf unzip wget sox gfortran libtool subversion python2.7 python3
RUN git clone https://github.com/kaldi-asr/kaldi.git kaldi --origin upstream
RUN apt install -y zlib1g-dev
RUN cd kaldi/tools && \
    extras/check_dependencies.sh && \
    make
RUN cd kaldi/tools && \
    extras/install_mkl.sh
RUN cd kaldi/src  && \
    ./configure  && \
    make depend  && \
    make
COPY downloads/srilm-1.7.3.zip ./
RUN unzip srilm-1.7.3.zip
RUN cd srilm-1.7.3 && \
    make NO_TCL=1 MACHINE_TYPE=i686-m64 World
ENV PATH "$PATH:/home/srilm/bin/i686-m64"
RUN mkdir server
WORKDIR /home/server
COPY ./ ./
RUN bash build_model.sh
CMD [ "python", "server.py" ]
