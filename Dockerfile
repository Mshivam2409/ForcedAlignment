FROM kaldiasr/kaldi:latest
WORKDIR /opt
RUN command
COPY downloads/srilm-1.7.3.zip ./
RUN unzip srilm-1.7.3.zip
RUN chmod 777 -R /opt
RUN cd srilm-1.7.3 && \
    make NO_TCL=1 MACHINE_TYPE=i686-m64 World
ENV PATH "$PATH:/home/srilm/bin/i686-m64"
RUN mkdir /opt/server
WORKDIR /opt/server
COPY ./ ./
RUN bash build_model.sh
RUN python -m pip install -r requirements.txt
RUN mkdir -p s3/audio s3/text s3/faligned
CMD [ "python", "server.py" ]
