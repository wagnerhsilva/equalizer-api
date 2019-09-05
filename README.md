# EQUALIZER API

Este repositório contém o código fonte da interface de usuário da Master Controller da solução *Equalizer* da CM Comandos.

# Características

Este projeto possui as seguintes características:

* Desenvolvido em Node.js na versão 8
* Banco de dados SQLite
* Front end baseado no template BootStrap SmartAdmin

# Desenvolvimento

Esta seção descreve procedimentos para configuração do ambiente de desenvolvimento em PC deste projeto.

Nas etapas finais de desenvolvimento, foi usado o **Windows Subsystem for Linux (WSL)** para desenvolvimento e uma distribuição **Ubuntu Linux 18.04**. Porém, é possível que funcione também no Windows nativamente.

## Configuração de ambiente

O primeiro passo é instalar o Ubuntu 18.04 na estação de trabalho Windows 10. Isso é feito através da loja de aplicativos do próprio Windows.

Uma vez concluída a instalação, deve-se abrir uma janela de terminal do Ubuntu.

O segundo passo é instalar o NodeJs na versão 8 no Ubuntu. Por não se tratar da ultima versão do NodeJs, foi utilizado o utilitário *NVM* para realização desta atividade.

>$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

Ao final dessa execução, é preciso fechar a janela de terminal e abrí-la novamente.

O passo seguinte é instalar o node na versão desejada:

>$ nvm install 8.15.1

Ao final dessa execução, o NodeJs na versão 8.15.1 e seu NPM correspondente estarão devidamente instalados. O comando a seguir define a versão recentement instalada como a padrão para o sistema.

>$ nvm alias default 8.15.1

Finalmente, o comando abaixo configura a versão padrão a ser usada do NodeJs na inicialização do terminal Ubuntu Linux.

>$ nvm use default

A partir das próximas aberturas de janelas de terminal, já será possível executar o NodeJs diretamente através do terminal.

## Download do projeto

O projeto deve ser baixado a partir do Github:

>$ git clone https://github.com/wagnerhsilva/equalizer-api.git

## Configuração do projeto

Assumindo que o projeto tenha sido baixado no diretório *<home>* do usuário:

>$ cd ~/equalizer-api/equalizer-api

O comando abaixo instala os componentes NodeJs necessários para funcionamento.

>$ npm install

O comando abaixo executa o software.

>$ nodemon bin/www

Através do utilitário *nodemon*, toda vez que o código fonte sofrer alteração, o sistema será automaticamente reinicializado.

## Visual Studio Code

O desenvolvimento das atividades finais foram realizados usando a ferramenta **Visual Studio Code**, da Microsoft.

Essa ferramenta é capaz de abrir o projeto que se encontra dentro do WSL. Para isso, é preciso verificar como proceder para instalação dos componentes corretos no editor e abrir a pasta do projeto.

Este [link](https://code.visualstudio.com/docs/cpp/config-wsl) mostra como este recurso funciona no software.

