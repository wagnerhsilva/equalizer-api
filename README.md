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

# Execução

O software pode ser acessado através de um browser na própria máquina.

O link a ser executado é o seguinte: http://localhost:3000

# Procedimento para inclusão de mais um idioma

O procedimento para inclusão de mais um idioma envolve duas partes:

1. Alteração no software **equalizer-api** (interface web)
2. Alteração do software **equalizer-serial-service** (serviço de leitura dos sensores)

O primeiro contém todas a interface com o usuário do produto, enquanto o segundo possui as mensagens de alarmes geradas.

## Alteração Equalizer-Api

O primeiro passo é a criação de um arquivo JSON a ser inserido no diretório *locales*, contendo o nome do idioma a ser criado (por exemplo, *es.json*).

Este arquivo deve conter a mesma estrutura dos arquivos JSON atualmente presentes no diretório, porém com o conteúdo traduzido para o novo idioma (no caso, espanhol).

Além disso, é preciso incluir mais um campo dentro de "idioma" em todos os arquivos JSON contendo o novo idioma a ser incorporado. **IMPORTANTE:** A chave a ser criada deve ter o nome a locale escolhida (no caso do exemplo inicial, deve ser 'es').

O segundo passo é incluir na lista de idiomas suportado o novo idioma. Isso é feito editando o arquivo **views/idiomaview.ejs**, a partir a linha 79.

Para o nosso exemplo de inclusão do espanhol, basta incluir a seguinte instrução:

```
<option value="es"><%= translate.es %></option>
```

Com essas alteração tem-se a inclusão de um novo idioma no produto, do ponto de vista de interface com o usuário.

# Alteração Equalizer-serial-service

Todas as mensagens referentes a idioma se encontram no arquivo **database.c**.

A primeira alteração a ser feita é incluir o suporte ao novo idioma nas mensagens presentes no software. Para isso, basta incluir um novo vetor de strings na variável **alert_messages**, definida na linha 75 do arquivo.

O segundo passo é criar um código para o novo idioma. Isso é feito no arquivo **defs.h**. Como exemplo, na linha 43 pode-se incluir o seguinte código:

```
#define LANG_CODE_ES 2
```

Por fim, deve-se incluir a detecção do novo idioma, a partir da leitura do idioma salvo no banco de dados. Para isso, seguindo o exemplo, deve-se incluir as seguintes instruções na linha 1154 do arquivo **database.c**:

```
else if (strcmp(text,"es") == 0) {
	Lang->code = LANG_CODE_ES;
} else {
    Lang->code = LANG_CODE_PT_BR;
}
```

Feitas essas alterações, deve-se recompilar o software para que as alterações possam ser efetivadas.
