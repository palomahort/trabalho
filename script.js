document.addEventListener('DOMContentLoaded', () => {

  // Objeto com as respostas corretas (gabarito) do quiz
  const gabarito = {
    'pergunta1': 'ax² + bx + c = 0', // Exemplo de resposta correta para pergunta 1
    'pergunta2': 'a soma das raízes é igual a -b/a', // Exemplo de resposta correta para pergunta 2
    'pergunta3': ['2x² - 5x + 1 = 0'], // Exemplo de resposta correta para pergunta 3
    'pergunta4': 'x = 2 ou x = -2' // Exemplo de resposta correta para pergunta 4
  };

  // Função para normalizar texto: remove acentos e converte para minúsculas
  function normalizeText(text) {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Seleciona a tag <main> onde os resultados serão mostrados
  const main = document.querySelector('main');
  const resultadoDiv = document.getElementById('resultadoFinal');

  // Função para enviar os dados por e-mail com EmailJS
  function sendEmail(resultados) {
    emailjs.send("service_id", "template_id", {
      name: resultados.name,
      email: resultados.email,
      pergunta1: resultados.pergunta1,
      pergunta2: resultados.pergunta2,
      pergunta3: resultados.pergunta3,
      pergunta4: resultados.pergunta4,
      acertos: resultados.acertos,
      erros: resultados.erros
    })
    .then((response) => {
      console.log('E-mail enviado com sucesso', response);
      resultadoDiv.innerHTML = `<p>Seu resultado foi enviado com sucesso para o administrador!</p>`;
    })
    .catch((error) => {
      console.error('Erro ao enviar o e-mail', error);
      resultadoDiv.innerHTML = `<p>Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.</p>`;
    });
  }

  // Evento de clique no botão "Enviar Respostas"
  document.getElementById('btnEnviar').addEventListener('click', (e) => {
    e.preventDefault(); // evita recarregar a página

    const emailInput = document.getElementById('emailUser');
    const email = emailInput.value.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert('Por favor, digite um email válido.');
      return;
    }

    let acertos = 0;
    let erros = 0;

    // === PERGUNTA 1 === (tipo radio)
    const p1 = document.querySelector('input[name="pergunta1"]:checked');
    const p1Resposta = p1 ? p1.value : 'sem resposta';
    if (p1 && p1.value === gabarito['pergunta1']) acertos++;
    else erros++;

    // === PERGUNTA 2 === (resposta de texto)
    const p2 = document.querySelector('input[name="pergunta2"]');
    const p2Resposta = p2 ? p2.value.trim() : 'sem resposta';
    if (p2 && normalizeText(p2.value) === normalizeText(gabarito['pergunta2'])) acertos++;
    else erros++;

    // === PERGUNTA 3 === (checkbox múltipla)
    const p3Checkboxes = document.querySelectorAll('input[name="pergunta3"]');
    const p3Selecionados = [];
    p3Checkboxes.forEach(cb => {
      if (cb.checked) p3Selecionados.push(cb.value);
    });
    const p3Resposta = p3Selecionados.length ? p3Selecionados.join(', ') : 'sem resposta';
    if (p3Selecionados.length === gabarito['pergunta3'].length && p3Selecionados.every(v => gabarito['pergunta3'].includes(v))) acertos++;
    else erros++;

    // === PERGUNTA 4 === (tipo radio)
    const p4 = document.querySelector('input[name="pergunta4"]:checked');
    const p4Resposta = p4 ? p4.value : 'sem resposta';
    if (p4 && p4.value === gabarito['pergunta4']) acertos++;
    else erros++;

    // Criando o objeto de resultados
    const resultados = {
      name: 'Usuário do Quiz', // Nome fictício, ou você pode adicionar uma input para nome
      email: email,
      pergunta1: p1Resposta,
      pergunta2: p2Resposta,
      pergunta3: p3Resposta,
      pergunta4: p4Resposta,
      acertos: acertos,
      erros: erros
    };

    // Envia o e-mail com os resultados
    sendEmail(resultados);

    // Exibe o resultado na tela para o usuário
    resultadoDiv.innerHTML = `
      <p><strong>Resultado para ${email}</strong></p>
      <p>Acertos: ${acertos}</p>
      <p>Erros: ${erros}</p>
      <p>Seu resultado foi salvo com sucesso!</p>
    `;
  });
});
