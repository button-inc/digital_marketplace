# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.192.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="12-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends default-jre

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"


ENV KC_VERSION=11.0.0
RUN curl https://downloads.jboss.org/keycloak/${KC_VERSION}/keycloak-${KC_VERSION}.zip --output keycloak-${KC_VERSION}.zip
RUN unzip keycloak-${KC_VERSION}.zip

#Use the add-user-keycloak.sh script provided by Keycloak to create an admin user. (Replace with Bryan's script later)
RUN /keycloak-${KC_VERSION}/bin/add-user-keycloak.sh -r master -u admin -p admin