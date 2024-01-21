import dotenv from 'dotenv';
//import puppeteer from 'puppeteer';
import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { heatingDto } from '../dto/heating.dto.js';

dotenv.config();

const getHeatingData = async () => {

//  const browser = await puppeteer.launch({ headless: 'new' });
  const executablePath = await edgeChromium.executablePath;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto('https://www.egedalfjernvarme.dk/eforsyning/#/login/sammenlign-forbrug', {
    waitUntil: 'networkidle2',
  });

  // email
  await page.waitForSelector('[id=\'forbrugerNr\']');
  await page.type('[id=\'forbrugerNr\']', process.env.HEATING_USER);

  // password
  await page.keyboard.down('Tab');
  await page.keyboard.type(process.env.HEATING_PASSWORD);
  await page.evaluate(() => {
    document.querySelector('#login')
      .click();
  });

  await page.waitForSelector('.highcharts-plot-band');
  const cryptId = await page.evaluate(() => {
    const data = window.sessionStorage.getItem('credentials');
    return Object.values(JSON.parse(data))[0].cryptId;
  });

  return fetch(`https://apiapp.dff-edb.dk/egedal/api/getnormtal?id=${cryptId}&unr=530020&anr=2&inr=1`, {
    method: 'POST',
    body: JSON.stringify({
      aCallKey: 0,
      ForbrugsAfgraensning_FraAflaesning: '0',
      ForbrugsAfgraensning_TilAflaesning: '2',
      Ejendomnr: +process.env.HEATING_USER,
      ForbrugsAfgraensning_FraMellNr: '0',
      ForbrugsAfgraensning_TilJournalNr: '0',
      BestemtEnhed: '0',
      Godkendelser: '0',
      RadEksponent2: '0',
      RadEksponent1: '0',
      AarsMaerke: 2023,
      ForbrugsAfgraensning_TilDato: '0',
      Optioner: 'foBestemtBeboer, foSkabDetaljer, foMedtagWebAflaes',
      ForbrugsAfgraensning_TilAfl_nr: '0',
      Belastningsfaktor: '0',
      ForbrugsAfgraensning_FraDato: '0',
      AHoejDetail: false,
      AktivNr: 2,
      ForbrugsAfgraensning_FraAfl_nr: '0',
      I_Nr: 1,
      ForbrugsAfgraensning_TilMellnr: '0',
      Aflaesningsfilter: 'afMaanedsvis',
      ForbrugsAfgraensning_MedtagMellemliggendeMellemaflas: false,
      SletFiltreredeAflaesninger: true,
      AflaesningsUdjaevning: false,
      MedForventetForbrug: false,
      AflaesningsFilterDag: 'ULTIMO',
      OmregnForbrugTilAktuelleEnhed: true,
    }),
  });
};

export const getHeating = async () => {
  const response = await getHeatingData();
  const result = await response.json();

  return heatingDto(result);
};
