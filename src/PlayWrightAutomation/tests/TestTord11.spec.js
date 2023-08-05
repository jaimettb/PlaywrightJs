import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://investidor10.com.br/');
  await page.locator('section').filter({ hasText: 'Pesquise pelo ativo desejado para ter acesso a cotação, fundamentos e gráficos p' }).getByPlaceholder('Pesquise pelo ativo desejado').click();
  await page.locator('section').filter({ hasText: 'Pesquise pelo ativo desejado para ter acesso a cotação, fundamentos e gráficos p' }).getByPlaceholder('Pesquise pelo ativo desejado').fill('tord11');
  await page.getByRole('link', { name: 'Azul TORD11 - TORD11 R$ 3,11 -62,17% (12 meses) Fii' }).click();
  await page.getByRole('link', { name: '1\nano', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mais comentários' }).click();
  await page.locator('#modal-sign-access button').click();
  await page.getByRole('link', { name: 'Indicadores TORDESILHAS EI FUNDO DE INVESTIMENTO IMOBILIÁRIO empresa' }).click();
  await page.pause();
});