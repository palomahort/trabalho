// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
  // Objeto com as respostas corretas (gabarito) do quiz
  const gabarito = {
    'pergunta1': 'ax² + bx + c = 0', // Radio
    'pergunta2': 'soma das raízes é igual a -b/a', // Texto livre
    'pergunta3': ['2x² - 5x + 1 = 0'], // Checkbox
    'pergunta4': 'x = 2 ou x = -2', // Radio
    'pergunta5': '16', // Radio
  };

  // Função para normalizar texto: remove acentos e converte para minúsculas
  function normalizeText(text) {
    return text
      .trim() // remove espaços no início/fim
      .toLowerCase() // tudo minúsculo
      .normalize("NFD") // separa letras de acentos
      .replace(/[\u0300-\u036f]/g, ""); // remove os acentos
  }

  // Seleciona a tag <main> onde os resultados serão mostrados
  const main = document.querySelector('main');

  // Cria dinamicamente uma nova seção no HTML para finalizar o quiz
  const resultadoSection = document.createElement('section');
  resultadoSection.innerHTML = `
    <h2>Finalize seu Quiz</h2>
    <label for="emailUser">Digite seu email para salvar seu resultado:</label><br>
    <input type="email" id="emailUser" required placeholder="seuemail@exemplo.com"><br><br>
    <button id="btnEnviar">Enviar Respostas</button>
    <div id="resultadoFinal" style="margin-top: 20px;"></div>
  `;
  main.appendChild(resultadoSection); // adiciona a seção ao DOM

  // Referências aos elementos de email, botão e div de resultado
  const btnEnviar = document.getElementById('btnEnviar');
  const emailInput = document.getElementById('emailUser');
  const resultadoDiv = document.getElementById('resultadoFinal');

  // Evento de clique no botão "Enviar Respostas"
  btnEnviar.addEventListener('click', (e) => {
    e.preventDefault(); // evita recarregar a página

    // Pega o email digitado e valida se está no formato básico
    const email = emailInput.value.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Por favor, digite um email válido.');
      return;
    }

    let acertos = 0; // contador de acertos
    let erros = 0;   // contador de erros

    // === PERGUNTA 1 === (tipo radio)
    const p1 = document.querySelector('input[name="pergunta1"]:checked');
    if (p1) {
      if (p1.value === gabarito['pergunta1']) acertos++;
      else erros++;
    } else erros++; // nenhuma opção selecionada

    // === PERGUNTA 2 === (resposta de texto)
    const p2 = document.querySelector('input[name="pergunta2"]');
    if (p2 && p2.value.trim() !== '') {
      if (normalizeText(p2.value) === normalizeText(gabarito['pergunta2'])) acertos++;
      else erros++;
    } else erros++; // resposta vazia

    // === PERGUNTA 3 === (checkbox múltipla)
    const p3Checkboxes = document.querySelectorAll('input[name="pergunta3"]');
    const p3Selecionados = [];

    // Armazena todas as opções marcadas
    p3Checkboxes.forEach(cb => {
      if (cb.checked) p3Selecionados.push(cb.value);
    });

    // Verifica se apenas as respostas corretas foram marcadas
    if (
      p3Selecionados.length === gabarito['pergunta3'].length &&
      p3Selecionados.every(v => gabarito['pergunta3'].includes(v))
    ) {
      acertos++;
    } else {
      erros++;
    }

    // === PERGUNTA 4 === (tipo radio com fórmula)
    const p4 = document.querySelector('input[name="pergunta4"]:checked');
    if (p4) {
      // Compara ignorando espaços entre os caracteres
      if (p4.value.replace(/\s+/g, '') === gabarito['pergunta4'].replace(/\s+/g, '')) acertos++;
      else erros++;
    } else erros++;

    // === PERGUNTA 5 === (tipo radio)
    const p5 = document.querySelector('input[name="pergunta5"]:checked');
    if (p5) {
      if (p5.value === gabarito['pergunta5']) acertos++;
      else erros++;
    } else erros++; // nenhuma opção selecionada

    // Cria um objeto com os dados do resultado
    const resultado = {
      acertos,
      erros,
      data: new Date().toLocaleString() // salva a data e hora local
    };

    // Salva os resultados no localStorage com o email como chave
    let banco = JSON.parse(localStorage.getItem('quizResultados') || '{}');
    banco[email] = resultado;
    localStorage.setItem('quizResultados', JSON.stringify(banco));

    // Preenche os campos ocultos do formulário com os dados do quiz
    document.getElementById('campoAcertos').value = acertos;
    document.getElementById('campoErros').value = erros;

    // Cria um resumo textual das respostas
    const respostasResumo = `
      Pergunta 1: ${p1 ? p1.value : 'sem resposta'}
      Pergunta 2: ${p2 ? p2.value.trim() : 'sem resposta'}
      Pergunta 3: ${p3Selecionados.join(', ') || 'sem resposta'}
      Pergunta 4: ${p4 ? p4.value : 'sem resposta'}
      Pergunta 5: ${p5 ? p5.value : 'sem resposta'}
    `;
    document.getElementById('campoResumo').value = respostasResumo.trim();

    // Exibe o resultado para o usuário na tela
    resultadoDiv.innerHTML = `
      <p><strong>Resultado para ${email}</strong></p>
      <p>Acertos: ${acertos}</p>
      <p>Erros: ${erros}</p>
      <p>Seu resultado foi salvo com sucesso!</p>
    `;
  });
});
