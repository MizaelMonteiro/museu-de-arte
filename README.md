Este é um sistema desenvolvido somente para aprendizado, portanto muitas partes estão inacabadas e a execução não é prática. Considerando isso, segue o passo a passo para executar o sistema na sua fase atual.

## Instalação das dependências

1. Instalar **Node.js** e **npm** (e configurar o `ExecutionPolicy` como `Unrestricted`).
2. Instalar o **VS Code**.
3. Instalar o **XAMPP**.
4. Instalar a biblioteca **Moment**.

Também é necessário baixar os seguintes arquivos do projeto:

- `museudearte.zip`
- `dbmuseu_de_arte.sql`

## Configuração do banco de dados

1. Abrir o **phpMyAdmin** acessando:  
   `http://localhost/phpmyadmin`

2. Criar um novo banco de dados com o nome **dbmuseu_de_arte**  
   *(o nome deve ser exatamente igual)*.

3. Selecionar o banco criado.

4. Ir na aba **Importar**.

5. Selecionar o arquivo `dbmuseu_de_arte.sql` e realizar a importação.

## Execução

1. Abrir o **XAMPP** e iniciar os serviços **Apache** e **MySQL**.
2. Descompactar o arquivo `museudearte.zip`.
3. Abrir a pasta do projeto no **VS Code**.
4. Criar um novo terminal e executar o comando `npm start`
5. Acessar `http://localhost:3000/introducao/introducao`
