
/*Logica de Negoócios, funções e operações permitidas na blockchain*/

/**
 * Função que processa a transação para abertura da solictação nas secretarias municipais ou estadual de saúde
 * @param {org.redejudicialmedv7.br.AbrirSolicitacaoMedicamento} tx
 * @transaction
 */

async function abrirSolicitacaoMedicamento(tx) {
  console.log('abrirSolicitacaoMedicamento');

  //Obtém os valores anteriores de propriedades do ativo
  const oldMovimento = tx.asset.movimento;
  const oldEsferaPublica = tx.asset.esferaPublica;
          
  tx.asset.movimento = tx.newMovimento;
  tx.asset.esferaPublica = tx.newEsferaPublica;

  /*Permite realizar a operação Caso sejam as secretarias municipal e estadual de saúde*/
  if ((tx.asset.esferaPublica.tipo=='SecretariaMunicipalSaude')||(tx.asset.esferaPublica.tipo=='SecretariaEstadualSaude'))
  {
     ///Atualiza o ativo com os novos valores
    const assetRegistry = await getAssetRegistry('org.redejudicialmedv7.br.ProcessoJudMed');
    await assetRegistry.update(tx.asset);

   //Emite o evento para modificar o ativo.
    let event = getFactory().newEvent('org.redejudicialmedv7.br', 'AbrirSolicitacaoMedicamentoEvent');
    event.asset = tx.asset;  
    event.oldMovimento = oldMovimento;
    event.oldEsferaPublica = oldEsferaPublica;   
    event.newMovimento =  "AbrirSolicitacaoMedicamento";
    event.newEsferaPublica = tx.newEsferaPublica;
    emit(event);   
  }

else
{
   throw new Error('ATENÇÃO: Não é possivel abrir um processo de solicitação na Secretaria de Saúde por que o participante solicitante é o Ministério Público');
}

}

/**
* Função que processa a transação de solicitação de compra para o medicamento do ativo
* @param {org.redejudicialmedv7.br.SolicitarCompra} tx 
* @transaction
*/
async function solicitarCompra(tx) { 
  console.log('solicitarCompra');

   //Obtém os valores anteriores de propriedades do ativo
   const oldMovimento = tx.asset.movimento;
   const oldEsferaPublica = tx.asset.esferaPublica; 
   tx.asset.movimento = "SolicitacaoCompra";
   tx.asset.esferaPublica = tx.newEsferaPublica; 

  /*Permite realizar a operação Caso sejam as secretarias municipal e estadual de saúde*/
  if ((tx.asset.esferaPublica.tipo=='SecretariaMunicipalSaude')||(tx.asset.esferaPublica.tipo=='SecretariaEstadualSaude'))
  {    

    /*Caso o movimento anterior tenha sido o de abrir solicitação na secretaria, permite solicitar compra*/ 
    if(oldMovimento=='AbrirSolicitacaoMedicamento')
    {  
     
     //Atualiza o ativo com os novos valores 
     const assetRegistry = await getAssetRegistry('org.redejudicialmedv7.br.ProcessoJudMed');
     await assetRegistry.update(tx.asset);

     //Emite o evento para modificar o ativo.
     let event = getFactory().newEvent('org.redejudicialmedv7.br', 'solicitacaoCompralEvent');
     event.asset = tx.asset;
     event.oldMovimento = oldMovimento;
     event.oldEsferaPublica = oldEsferaPublica;   
     event.newMovimento =  "SolicitacaoCompra";
     event.newEsferaPublica = tx.newEsferaPublica;
     emit(event);
    }
    else
       throw new Error('ATENÇÃO: Não é possivel solicitar Compra por que ainda não foi registrada a abertura do processo na secretaria municipal/estadual de saúde'); 
  }     
    else
      throw new Error('ATENÇÃO: Não é possivel solicitação a compra por que o participante solicitante é o Ministério Público')    
}

/**
* Função que processa a transação que disponibiliza o medicamento no almoxarifado
* @param {org.redejudicialmedv7.br.DisponibilizarAlmoxarifado} tx
* @transaction
*/
async function disponibilizarAlmoxarifado(tx) {
  console.log('disponibilizarAlmoxarifado');

  //Obtém os valores anteriores de propriedades do ativo
  const oldMovimento = tx.asset.movimento; 
  const oldEsferaPublica = tx.asset.esferaPublica;
  tx.asset.movimento = "DisponivelAlmoxarifado";
  tx.asset.esferaPublica = tx.newEsferaPublica; 

  /*Permite realizar a operação Caso sejam as secretarias municipal e estadual de saúde*/
  if ((tx.asset.esferaPublica.tipo=='SecretariaMunicipalSaude')||(tx.asset.esferaPublica.tipo=='SecretariaEstadualSaude'))
  {              
    
    /*Caso o movimento anterior tenha sido o de solicitar compra, permite disponibilizar no almoxarifado*/ 
    if(oldMovimento=='SolicitacaoCompra')
    {

     //Atualiza o ativo com os novos valores 
     const assetRegistry = await getAssetRegistry('org.redejudicialmedv7.br.ProcessoJudMed'); 
     await assetRegistry.update(tx.asset);

    //Emite o evento para modificar o ativo.
    let event = getFactory().newEvent('org.redejudicialmedv7.br', 'disponivelAlmoxarifadoEvent');
    event.asset = tx.asset;  
    event.oldMovimento = oldMovimento;
    event.oldEsferaPublica = oldEsferaPublica;    
    event.newMovimento = "DisponivelAlmoxarifado";
    event.newEsferaPublica = tx.newEsferaPublica;
    emit(event);
   }
  else 
   throw new Error('ATENÇÃO: Não é possivel disponibilizar no almoxarifado por que ainda não foi registrada a solicitacao de compra de medicamento para esse processo judicial');     
  }   
else
   throw new Error('ATENÇÃO: Não é possivel disponibilizar no Almoxarifado por que o participante solicitante é o Ministério Público');
}

/**
* Função que processa a transação que disponibiliza o medicamento para a entrega na unidade de saúde
* @param {org.redejudicialmedv7.br.DisponibilizarUnidadeEntrega} tx
* @transaction
*/
async function disponibilizarUnidadeEntrega(tx) {
  console.log('DisponivelRetirada');
 
  //Obtém os valores anteriores de propriedades do ativo
  const oldMovimento = tx.asset.movimento;
  const oldEsferaPublica = tx.asset.esferaPublica;
  //const oldUnidadeEntrega = tx.asset.unidadeEntrega;
  tx.asset.movimento = "EnvioUnidadeEntrega";
  tx.asset.esferaPublica = tx.newEsferaPublica;
  tx.asset.unidadeEntrega = tx.newUnidadeEntrega;

  /*Permite realizar a operação Caso sejam as secretarias municipal e estadual de saúde*/
  if ((tx.asset.esferaPublica.tipo=='SecretariaMunicipalSaude')||(tx.asset.esferaPublica.tipo=='SecretariaEstadualSaude'))
  {

    if(oldMovimento=='DisponivelAlmoxarifado')
    {

    //Atualiza o ativo com os novos valores 
     const assetRegistry = await getAssetRegistry('org.redejudicialmedv7.br.ProcessoJudMed');
     await assetRegistry.update(tx.asset);

   //Emite o evento para modificar o ativo.
    let event = getFactory().newEvent('org.redejudicialmedv7.br', 'disponivelUnidadeEntregaEvent');
    event.asset = tx.asset;
    event.oldMovimento = oldMovimento;
    event.oldEsferaPublica = oldEsferaPublica;
    //event.oldUnidadeEntrega = oldUnidadeEntrega;    
    event.newMovimento = "DisponivelRetirada";
    event.newEsferaPublica = tx.newEsferaPublica;
    event.newUnidadeEntrega = tx.newUnidadeEntrega;
    emit(event);
   }
  else
   throw new Error('ATENÇÃO: Não é possivel disponibilizar para a entrega por que ainda não foi registrada a chegada no almoxarifado');    
}   
else
   throw new Error('ATENÇÃO: Não é possivel disponibilizar para a entrega por que o participante solicitante é o Ministério Público'); 
}

/**
* Função que processa a transação para confirmação da retirada do medicamento pelo paciente
* @param {org.redejudicialmedv7.br.ConfirmarRetirada} tx
* @transaction
*/
async function confirmarRetirada(tx) {
  console.log('ConfimacaoRetirada');
  
  //Obtém os valores anteriores de propriedades do ativo
  const oldMovimento = tx.asset.movimento;
  const oldConcluido = tx.asset.concluido;
  const oldEsferaPublica = tx.asset.esferaPublica;
  tx.asset.movimento = "ConfimacaoRetirada";  
  tx.asset.concluido = "Sim";
  tx.asset.esferaPublica = tx.newEsferaPublica;

 /*Permite realizar a operação Caso sejam as secretarias municipal e estadual de saúde*/
  if ((tx.asset.esferaPublica.tipo=='SecretariaMunicipalSaude')||(tx.asset.esferaPublica.tipo=='SecretariaEstadualSaude'))
  {  
    if((oldMovimento=='DisponivelAlmoxarifado')||(oldMovimento=='EnvioUnidadeEntrega'))
    {        
    
      //Atualiza o ativo com os novos valores  
      const assetRegistry = await getAssetRegistry('org.redejudicialmedv7.br.ProcessoJudMed');
      await assetRegistry.update(tx.asset);

    //Emite o evento para modificar o ativo.
     let event = getFactory().newEvent('org.redejudicialmedv7.br', 'retiradaConfirmadaEvent');
     event.asset = tx.asset;
     event.oldMovimento = oldMovimento; 
     event.oldConcluido = oldConcluido;
     event.oldEsferaPublica = oldEsferaPublica; 

     event.newMovimento = "ConfimacaoRetirada";
     event.newConcluido = "Sim";
     event.newEsferaPublica = tx.newEsferaPublica;
     emit(event);    
  }  
    else
     throw new Error('ATENÇÃO: Não é possivel confirmar a retirada por que ainda não foi registrada a chegada do medicamento no almoxarifado ou na unidade de saúde'+ 'Ultimo Movimento:' +oldMovimento);   
  }
  
else
   throw new Error('ATENÇÃO: Não é possivel confirmar a retirada por que o participante solicitante é o Ministério Público');  
}
