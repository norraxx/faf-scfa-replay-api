FROM python:3.6-slim

LABEL maintainer="FAF Community"
LABEL version="0.0.1"
LABEL description="Forged Alliance Forever: Replay parser api"

EXPOSE 13666

COPY . /var/faf-scfa-replay-api
RUN apt-get update && apt-get install -y git && \
    pip install --upgrade pip && \
    pip3 install pipenv && \
    cd /var/faf-scfa-replay-api && pipenv install --deploy --system && \
    apt-get remove -y git libicu-dev libicu57 g++-6 python3-pip && \
    apt-get autoremove -y && \
    chmod u+x /var/faf-scfa-replay-api/run.sh

CMD /var/faf-scfa-replay-api/run.sh
