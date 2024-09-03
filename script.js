function registrarProduto() {
    const nome = document.getElementById("produtoNome").value;
    const descricao = document.getElementById("produtoDesc").value;
    const preco = document.getElementById("produtoPreco").value;
    const quantidade = document.getElementById("produtoQtd").value;

    if (!nome || !descricao || !preco || !quantidade) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    fetch("https://diniz.dev.br/produtos/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            descricao: descricao,
            preco: preco,
            quantidade: quantidade
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        exibirProdutos();
        limparCampos();
    })
    .catch(err => console.error('Erro ao cadastrar o produto:', err));
}

function limparCampos() {
    document.getElementById("produtoNome").value = '';
    document.getElementById("produtoDesc").value = '';
    document.getElementById("produtoPreco").value = '';
    document.getElementById("produtoQtd").value = '';
}

function exibirProdutos() {
    fetch("https://diniz.dev.br/produtos/")
    .then(response => response.json())
    .then(produtos => {
        let tabelaConteudo = '';
        produtos.forEach(produto => {
            tabelaConteudo += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.descricao}</td>
                <td>${produto.preco}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="abrirEdicao(${produto.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarProduto(${produto.id})">Excluir</button>
                </td>
            </tr>`;
        });
        document.getElementById('produtoTabela').innerHTML = tabelaConteudo;
    })
    .catch(err => console.error('Erro ao carregar os produtos:', err));
}

let produtoEmEdicao = null;

function abrirEdicao(id) {
    produtoEmEdicao = id;

    fetch(`https://diniz.dev.br/produtos/?id=${id}`)
    .then(response => response.json())
    .then(produto => {
        document.getElementById("modalNome").value = produto.nome;
        document.getElementById("modalDescricao").value = produto.descricao;
        document.getElementById("modalPreco").value = produto.preco;
        document.getElementById("modalQtd").value = produto.quantidade;

        $('#editarProdutoModal').modal('show');
    })
    .catch(err => console.error('Erro ao carregar o produto para edição:', err));
}

function salvarEdicao() {
    const nome = document.getElementById("modalNome").value;
    const descricao = document.getElementById("modalDescricao").value;
    const preco = document.getElementById("modalPreco").value;
    const quantidade = document.getElementById("modalQtd").value;

    if (!nome || !descricao || !preco || !quantidade) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    fetch(`https://diniz.dev.br/produtos/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: produtoEmEdicao,
            nome: nome,
            descricao: descricao,
            preco: preco,
            quantidade: quantidade
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        $('#editarProdutoModal').modal('hide');
        exibirProdutos();
    })
    .catch(err => console.error('Erro ao salvar as alterações:', err));
}

function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`https://diniz.dev.br/produtos/?id=${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            exibirProdutos();
        })
        .catch(err => console.error('Erro ao excluir o produto:', err));
    }
}