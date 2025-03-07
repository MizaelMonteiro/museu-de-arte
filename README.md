O banco de dados foi projetado para gerenciar as principais áreas de atuação de um museu de arte, armazenando informações sobre exposições, sessões, obras, autores, visitantes, funcionários e nacionalidades. Ele foi estruturado de forma relacional, com varias chaves estrangeiras que garantem a integridade e permitem a criação de consultas complexas para relatórios e análises.


## Começando
Primeiro, se você não tiver o Node.js, baixe-o neste link: [clique](https://nodejs.org/en/download/)

Depois, procure por PowerShell na barra de pesquisa e, com o botão direito, escolha Executar como administrador
Após o PowerShell ser aberto, digite set-executionpolicy unrestricted. Responda S.
Na sequência, é necessário configurar a variável de ambiente para localizar o npm:
 - Pesquisar por “Editar as variáveis de ambiente do sistema”
 - No botão “Variáveis de Ambiente...”, acessar a caixa “Variáveis do sistema” e procurar pela variável “Path”
 - Ao selecionar a variável, clicar no botão “Editar...”
 - Clicar no botão “Novo” e informar o caminho do npm. Normalmente, está no caminho em “C:\Program Files\nodejs”
 - Confirmar a criação da variável
 - Para que a variável seja atualizada, deve-se fechar o PowerShell e reabri-lo;

Na sequência, reabra o PowerShell (como Admin) e instale o TypeScript usando o seguinta comando: npm install -g typescript

Agora que temos tudo instalado, vamos para o funcionamento

Abra o XAMPP, e aperte "Start" nas opções do Apache e MySQL
Em seguida,abra o Visual Studio Code, abra um novo terminal e digite "npm start"
Abra qualquer navegador e na barra de pesquisa digite: 'localhost:3000/autores/listar'

Dependendo de qual palavra você botar na barra, você será redirecionado a páginas diferentes contendo informações diferentes:
Se quiser ver as obras digite: 'localhost:3000/obras/listar'
Se quiser ver os autores digite: 'localhost:3000/autores/listar'
Se quiser ver os funcionarios digite: 'localhost:30/funcionarios/listar'
Se quiser ver as sessões digite: 'localhost:3000/sessoes/listar'
Se quiser ver os visitantes digite: 'localhost:3000/visitantes/listar'

## O Banco de Dados em Si
Tabelas e Relacionamentos
TbExposicao

Finalidade: Armazenar os dados das exposições do museu.
Principais Colunas:
IdExposicao (chave primária)
TituloExposicao – o nome da exposição
DuracaoExposicao – pode indicar, por exemplo, "Permanente" ou um período específico
DtInicioExposicao – data de início da exposição
DtFimExposicao – data de encerramento da exposição
Observação: Essa tabela é referenciada por outras, como TbSessao e TbVisitanteExposicao.
TbSessao

Finalidade: Registrar as sessões, que podem representar ambientes ou períodos específicos dentro de uma exposição.
Principais Colunas:
IdSessao (chave primária)
NoSessao – nome ou identificação da sessão
LocalSessao – localização física da sessão
QtdObrasSessao – quantidade de obras presentes na sessão
IdExposicao – chave estrangeira que vincula a sessão à exposição correspondente
Relacionamento: Cada sessão está associada a uma única exposição (TbExposicao).
TbObra

Finalidade: Armazenar informações sobre as obras de arte que compõem as exposições.
Principais Colunas:
IdObra (chave primária)
TituloObra – título da obra
TecnicaObra – técnica utilizada na obra
AnoObra – ano de criação da obra
IdSessao – chave estrangeira que indica em qual sessão a obra está exposta
IdAutor – chave estrangeira que identifica o autor da obra
Relacionamentos: Liga a obra a uma sessão (e, consequentemente, a uma exposição) e a um autor.
TbAutor

Finalidade: Registrar os autores das obras.
Principais Colunas:
IdAutor (chave primária)
NoAutor – nome do autor
Relacionamento: Referenciado por TbObra.
TbVisitante

Finalidade: Armazenar os dados dos visitantes do museu.
Principais Colunas:
IdVisitante (chave primária)
NoVisitante – nome do visitante
IdadeVisitante – idade
SexoVisitante – sexo
IdNacionalidade – chave estrangeira que referencia a nacionalidade do visitante
Relacionamento: Conecta-se à tabela TbNacionalidade.
TbVisitanteExposicao

Finalidade: Registrar as visitas dos visitantes às exposições.
Principais Colunas:
IdVisitanteExposicao (auto increment, chave primária)
IdVisitante – referência ao visitante
IdExposicao – referência à exposição visitada
DataVisita – data em que a visita ocorreu
Relacionamento: Liga visitantes a exposições, possibilitando consultas de ranking e análises de visitas.
TbFuncionario

Finalidade: Armazenar dados dos funcionários do museu.
Principais Colunas:
IdFuncionario (chave primária)
NoFuncionario – nome do funcionário
Funcao – função ou cargo
DataContratacao – data de contratação
DataDemissao – data de demissão (pode ser nula ou conter valor especial para funcionários ativos)
IdSessao – chave estrangeira que indica a sessão em que o funcionário atua
Relacionamento: Cada funcionário está designado a uma sessão.
TbNacionalidade

Finalidade: Manter os registros de nacionalidades para autores, visitantes (e possivelmente funcionários).
Principais Colunas:
IdNacionalidade (chave primária)
NoNacionalidade – nome da nacionalidade