import {test,expect} from '@playwright/test';
test('Trainers has its own CTA and saves trainer details with honest WhatsApp delivery state',async({page})=>{
 await page.goto('/admin');const opener=page.getByRole('button',{name:'Open navigation',exact:true});if(await opener.isVisible())await opener.click();
 await page.getByRole('navigation',{name:'Owner navigation'}).getByRole('button',{name:'Trainers',exact:true}).click();
 await expect(page.getByRole('button',{name:'Add member',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Add trainer',exact:true}).click();
 const form=page.getByRole('dialog',{name:'Welcome a new coach.'});
 await form.getByLabel('Full name').fill('New Strength Coach');await form.getByLabel('Sign-in email').fill('coach@example.com');await form.getByLabel('WhatsApp number').fill('9876543210');await form.getByLabel('Specialty').fill('Strength & conditioning');
 await form.getByRole('button',{name:'Save trainer',exact:true}).click();await expect(form.getByRole('alert')).toContainText('country code');
 await form.getByLabel('WhatsApp number').fill('+91 98765 43210');await form.getByRole('button',{name:'Save trainer',exact:true}).click();
 await expect(form).toContainText('Trainer added · WhatsApp not sent');await expect(form).toContainText('+919876543210');await expect(form.getByRole('status')).toContainText('No account or password has been created');
 await form.getByRole('button',{name:'Close',exact:true}).click();await expect(page.getByRole('heading',{name:'New Strength Coach',exact:true})).toBeVisible();
 const card=page.getByRole('heading',{name:'New Strength Coach',exact:true}).locator('..');await expect(card).toContainText('WhatsApp invitation · Not sent');
 await page.getByRole('button',{name:'Add trainer',exact:true}).click();await form.getByLabel('Full name').fill('New Strength Coach');await form.getByLabel('Sign-in email').fill('other@example.com');await form.getByLabel('WhatsApp number').fill('+919876543211');await form.getByLabel('Specialty').fill('Mobility');await form.getByRole('button',{name:'Save trainer',exact:true}).click();await expect(form.getByRole('alert')).toContainText('already exists');
});
