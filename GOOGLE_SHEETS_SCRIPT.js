/**
 * GOOGLE APPS SCRIPT - VITRINNI LOUNGE (Versão Simplificada)
 * Sistema de Lista de Eventos - Apenas Nome e Horário
 *
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Abra: https://docs.google.com/spreadsheets/d/1e4SvVMhkJkMRggY8yaaccfRpluOgh_UjWyK9fJ70NKI/edit
 * 2. Vá em Extensões > Apps Script
 * 3. Apague todo o código padrão
 * 4. Cole este código completo
 * 5. Clique em "Implantar" > "Nova implantação"
 * 6. Tipo: "Aplicativo da Web"
 * 7. Executar como: "Eu" (sua conta)
 * 8. Quem tem acesso: "Qualquer pessoa"
 * 9. Clique em "Implantar"
 * 10. Copie a URL gerada e envie para configuração
 */

// ========================================
// CONFIGURAÇÕES
// ========================================

const SPREADSHEET_ID = '1e4SvVMhkJkMRggY8yaaccfRpluOgh_UjWyK9fJ70NKI';
const TIMEZONE = 'America/Sao_Paulo'; // Fuso horário do Brasil

// ========================================
// FUNÇÃO PRINCIPAL - Recebe dados do formulário
// ========================================

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);

    Logger.log('Dados recebidos:', dados);

    // Validação básica
    if (!dados.nome || !dados.evento_data) {
      return createResponse(false, 'Dados incompletos (nome ou data do evento)');
    }

    // Abrir planilha
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Formatar nome da aba (ex: "Segunda - 27/01/26")
    const nomeAba = formatarNomeAba(dados.evento_data);

    // Obter ou criar aba do evento
    let sheet = ss.getSheetByName(nomeAba);

    if (!sheet) {
      sheet = criarAbaEvento(ss, nomeAba, dados.evento || 'Evento');
    }

    // Adicionar registro
    adicionarRegistro(sheet, dados);

    return createResponse(true, 'Nome adicionado à lista com sucesso!', {
      aba: nomeAba,
      linha: sheet.getLastRow()
    });

  } catch (error) {
    Logger.log('Erro:', error);
    return createResponse(false, error.toString());
  }
}

// ========================================
// FUNÇÃO GET - Criar aba manualmente
// ========================================

function doGet(e) {
  try {
    const acao = e.parameter.acao;

    if (acao === 'criar_aba') {
      const evento = e.parameter.evento || 'Evento';
      const data = e.parameter.data || new Date().toISOString().split('T')[0];

      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const nomeAba = formatarNomeAba(data);
      let sheet = ss.getSheetByName(nomeAba);

      if (!sheet) {
        sheet = criarAbaEvento(ss, nomeAba, evento);
        return createResponse(true, `Aba "${nomeAba}" criada com sucesso!`);
      } else {
        return createResponse(true, `Aba "${nomeAba}" já existe.`);
      }
    }

    if (acao === 'ocultar_aba') {
      const data = e.parameter.data;
      if (!data) {
        return createResponse(false, 'Data não fornecida');
      }

      const nomeAba = formatarNomeAba(data);
      const resultado = ocultarAbaEvento(nomeAba);

      if (resultado) {
        return createResponse(true, `Aba "${nomeAba}" ocultada com sucesso!`);
      } else {
        return createResponse(false, `Aba "${nomeAba}" não encontrada`);
      }
    }

    return createResponse(true, 'API Vitrinni Lounge - Sistema de Eventos');

  } catch (error) {
    Logger.log('Erro no GET:', error);
    return createResponse(false, error.toString());
  }
}

// ========================================
// CRIAR ABA DO EVENTO
// ========================================

function criarAbaEvento(ss, nomeAba, nomeEvento) {
  // Criar nova aba
  const sheet = ss.insertSheet(nomeAba);

  // Cabeçalho simplificado: apenas Nome e Horário
  const headers = ['Nome Completo', 'Horário'];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // Estilizar cabeçalho
  headerRange.setBackground('#4a148c'); // Roxo escuro Vitrinni
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');

  // Ajustar largura das colunas
  sheet.setColumnWidth(1, 300); // Nome Completo
  sheet.setColumnWidth(2, 150); // Horário

  // Adicionar informações do evento (colunas D e E)
  sheet.getRange('D1').setValue('📊 RESUMO');
  sheet.getRange('D1').setFontWeight('bold').setFontSize(12).setBackground('#4a148c').setFontColor('#ffffff');

  sheet.getRange('D2').setValue('Evento:');
  sheet.getRange('E2').setValue(nomeEvento);

  sheet.getRange('D3').setValue('Data:');
  sheet.getRange('E3').setValue(nomeAba);

  sheet.getRange('D4').setValue('Total:');
  sheet.getRange('E4').setFormula('=COUNTA(A2:A)');

  // Estilizar resumo
  sheet.getRange('D2:D4').setFontWeight('bold');
  sheet.getRange('E2:E4').setBackground('#f3e5f5');

  // Congelar primeira linha
  sheet.setFrozenRows(1);

  // Centralizar coluna de horário
  sheet.getRange('B:B').setHorizontalAlignment('center');

  Logger.log(`Aba "${nomeAba}" criada com sucesso`);

  return sheet;
}

// ========================================
// ADICIONAR REGISTRO
// ========================================

function adicionarRegistro(sheet, dados) {
  // Pegar horário atual no fuso do Brasil
  const agora = new Date();
  const horarioBrasil = Utilities.formatDate(agora, TIMEZONE, 'HH:mm:ss');

  const row = [
    dados.nome || '',
    horarioBrasil
  ];

  sheet.appendRow(row);

  // Formatar linha adicionada
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow, 1, 1, 2);

  // Alternar cores (zebrado)
  if (lastRow % 2 === 0) {
    range.setBackground('#f9f9f9');
  }

  // Aumentar altura da linha
  sheet.setRowHeight(lastRow, 30);

  Logger.log(`Registro adicionado na linha ${lastRow}: ${dados.nome} às ${horarioBrasil}`);
}

// ========================================
// FORMATAR NOME DA ABA
// ========================================

function formatarNomeAba(dataISO) {
  // Converter "2026-01-27" para "Segunda - 27/01/26"

  try {
    const partes = dataISO.split('-');
    const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Mês começa em 0
    const dia = parseInt(partes[2]);

    const data = new Date(ano, mes, dia);

    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = diasSemana[data.getDay()];

    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes + 1).padStart(2, '0');
    const anoFormatado = String(ano).slice(-2);

    return `${diaSemana} - ${diaFormatado}/${mesFormatado}/${anoFormatado}`;

  } catch (error) {
    Logger.log('Erro ao formatar data:', error);
    return 'Evento - ' + dataISO;
  }
}

// ========================================
// OCULTAR ABA DO EVENTO
// ========================================

function ocultarAbaEvento(nomeAba) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(nomeAba);

    if (sheet) {
      sheet.hideSheet();
      Logger.log(`Aba "${nomeAba}" ocultada`);
      return true;
    }

    Logger.log(`Aba "${nomeAba}" não encontrada`);
    return false;

  } catch (error) {
    Logger.log('Erro ao ocultar aba:', error);
    return false;
  }
}

// ========================================
// CRIAR RESPOSTA JSON
// ========================================

function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    ...data
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// TRIGGER AUTOMÁTICO - Ocultar eventos passados
// ========================================

/**
 * Configure um trigger para executar esta função diariamente às 4h:
 * 1. No Apps Script, clique em "Gatilhos" (ícone de relógio)
 * 2. Clique em "+ Adicionar gatilho"
 * 3. Função: ocultarEventosPassados
 * 4. Tipo de evento: Com base em tempo
 * 5. Tipo: Acionador diário
 * 6. Hora do dia: 4h às 5h
 * 7. Salvar
 */
function ocultarEventosPassados() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets();
    const agora = new Date();

    sheets.forEach(sheet => {
      const nomeAba = sheet.getName();

      // Ignorar abas que não são de eventos (não seguem o padrão)
      if (!nomeAba.includes(' - ')) {
        return;
      }

      try {
        // Extrair data do nome da aba (ex: "Segunda - 27/01/26")
        const partes = nomeAba.split(' - ')[1]; // "27/01/26"
        if (!partes) return;

        const [dia, mes, ano] = partes.split('/');
        const anoCompleto = '20' + ano;

        const dataEvento = new Date(anoCompleto, parseInt(mes) - 1, parseInt(dia));

        // Adicionar 4 horas ao dia seguinte
        const dataRemocao = new Date(dataEvento);
        dataRemocao.setDate(dataRemocao.getDate() + 1); // Dia seguinte
        dataRemocao.setHours(4, 0, 0, 0); // 4h da manhã

        // Se já passou das 4h do dia seguinte, ocultar
        if (agora >= dataRemocao) {
          sheet.hideSheet();
          Logger.log(`Aba "${nomeAba}" ocultada automaticamente (evento passou)`);
        }

      } catch (error) {
        Logger.log(`Erro ao processar aba "${nomeAba}":`, error);
      }
    });

    Logger.log('Verificação de eventos passados concluída');

  } catch (error) {
    Logger.log('Erro ao ocultar eventos passados:', error);
  }
}

// ========================================
// FUNÇÃO DE TESTE
// ========================================

function testar() {
  // Teste criar aba
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const nomeAba = formatarNomeAba('2026-01-27');
  Logger.log('Nome da aba:', nomeAba);

  let sheet = ss.getSheetByName(nomeAba);
  if (!sheet) {
    sheet = criarAbaEvento(ss, nomeAba, 'VICRIME');
  }

  // Teste adicionar registro
  adicionarRegistro(sheet, {
    nome: 'Teste da Silva',
    evento_data: '2026-01-27'
  });

  Logger.log('Teste concluído!');
}
