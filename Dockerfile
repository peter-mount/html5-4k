# Docker file to build our html5 animation image

# Build ltc-tools for timecode generation
ARG arch=amd64
ARG goos=linux
FROM docker.ceres.area51.dev/area51/ubuntu:dev-20.04 AS compile
WORKDIR /work
RUN area51-apt-get install -y libltc-dev libjack-dev libsndfile-dev

RUN git clone https://github.com/peter-mount/ltc-tools.git
RUN mkdir -p /dest && cd ltc-tools && make install DESTDIR=/dest

# Build the final image
ARG arch=amd64
ARG goos=linux
FROM docker.ceres.area51.dev/area51/ubuntu:chromium-20.04 AS final

RUN area51-apt-get install -y \
        xvfb libgl1-mesa-dri \
        ffmpeg \
        libltc-dev libjack-dev libsndfile-dev

RUN useradd --create-home -s /bin/bash user &&\
    echo user:ubuntu | chpasswd &&\
    adduser user sudo

# xvfb settings
COPY xvfb-startup.sh /usr/local/bin/xvfb-startup
RUN sed -i 's/\r$//' /usr/local/bin/xvfb-startup
ARG RESOLUTION="3840x2160x24"
ENV XVFB_RES="${RESOLUTION}"
ARG XARGS=""
ENV XVFB_ARGS="${XARGS}"

# Install ltc-tools
COPY --from=compile /dest/ /

# Copy the project into /work
WORKDIR /work
ADD . .

RUN cp -rp /usr/local/share/chrome-remote-interface/* . &&\
    chown -R 1000:1000 /work

USER 1000

#CMD '/work/run.sh'
