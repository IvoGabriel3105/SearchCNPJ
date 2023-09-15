document.addEventListener("DOMContentLoaded", function () {
    const cnpjInput = document.getElementById("cnpjInput");
    const consultarButton = document.getElementById("consultarButton");
    const tabelaResultados = document.getElementById("tabelaResultados").querySelector("tbody");

    consultarButton.addEventListener("click", async () => {
        const cnpj = cnpjInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (cnpj.length !== 14) {
            alert("Por favor, insira um CNPJ válido.");
            return;
        }

        // Consulta a API com o CNPJ informado, com api fetch chamar assiclona
        try {
            const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
            if (!response.ok) {
                throw new Error("Erro na consulta da API");
            }

            const data = await response.json();

            // Adiciona o resultado à tabela de resultados
            adicionarResultado(
                cnpj,
                data.nome,
                `${data.logradouro}`,
                data.complemento,
                data.numero,
                data.abertura,
                data.municipio,
                data.cep,
                data.motivo,
                data.uf
            );

            // Salva os dados consultados na localStorage
            salvarDadosConsultados(
                cnpj,
                data.nome,
                `${data.logradouro}`,
                data.complemento,
                data.numero,
                data.abertura,
                data.municipio,
                data.cep,
                data.motivo,
                data.uf
            );

        } catch (error) {
            alert(`Ocorreu um erro: ${error.message} por excesso de consultas aguarde alguns instantes`);
        }
    });

    // Função para adicionar o resultado à tabela de resultados
    function adicionarResultado(
        cnpj, nome, logradouro, complemento, numero, abertura, municipio, cep, motivo, estado) {
        const newRow = tabelaResultados.insertRow();
        const newCellCnpj = newRow.insertCell(0);
        const newCellNome = newRow.insertCell(1);
        const newCellLogradouro = newRow.insertCell(2);
        const newCellComplemento = newRow.insertCell(3);
        const newCellNumero = newRow.insertCell(4);
        const newCellAbertura = newRow.insertCell(5);
        const newCellMunicipio = newRow.insertCell(6);
        const newCellCep = newRow.insertCell(7);
        const newCellMotivo = newRow.insertCell(8);
        const newCellEstado = newRow.insertCell(9);

        newCellCnpj.textContent = cnpj;
        newCellNome.textContent = nome;
        newCellLogradouro.textContent = logradouro;
        newCellComplemento.textContent = complemento;
        newCellNumero.textContent = numero;
        newCellAbertura.textContent = abertura;
        newCellMunicipio.textContent = municipio;
        newCellCep.textContent = cep;
        newCellMotivo.textContent = motivo;
        newCellEstado.textContent = estado;
    }

    // Função para salvar os dados na localStorage
    function salvarDadosConsultados(
        cnpj, nome, logradouro, complemento, numero, abertura, municipio, cep, motivo, estado) {
        // Verifica se já existem dados na localStorage
        let dadosConsultados = localStorage.getItem("dadosConsultados");
        if (!dadosConsultados) {
            dadosConsultados = [];
        } else {
            dadosConsultados = JSON.parse(dadosConsultados);
        }

        // Adiciona os novos dados à lista existente
        dadosConsultados.push({
            cnpj, nome, logradouro, complemento, numero, abertura, municipio, cep, motivo, estado
        });

        // Salva a lista atualizada na localStorage
        localStorage.setItem("dadosConsultados", JSON.stringify(dadosConsultados));
    }
});


    // Função para exportar a tabela para Excel
    document.getElementById("export-button").addEventListener("click", function () {
        var table = document.getElementById("tabelaResultados");
        var wb = XLSX.utils.table_to_book(table);
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        function ExporExcel(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }

        var blob = new Blob([ExporExcel(wbout)], { type: "application/octet-stream" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "table_data.xlsx";
        link.click();
    });
