import {test,expect} from '@playwright/test';
test('trainer details manage presence, member assignments and protect active schedules',async({page})=>{
 await page.clock.setFixedTime(new Date('2026-11-27T06:30:00Z'));await page.goto('/admin');
 const open=page.getByRole('button',{name:'Open navigation',exact:true});if(await open.isVisible())await open.click();await page.getByRole('navigation',{name:'Owner navigation'}).getByRole('button',{name:'Trainers',exact:true}).click();
 await page.getByRole('heading',{name:'Kabir Mehta',exact:true}).locator('..').getByRole('button',{name:'View coach',exact:true}).click();
 const details=page.getByRole('dialog',{name:'Kabir Mehta',exact:true});await expect(details).toContainText('Upcoming classes');await expect(details.getByRole('button',{name:'Renew or change plan'})).toHaveCount(0);
 await details.getByRole('button',{name:'Check in',exact:true}).click();await expect(details.getByRole('button',{name:'Check out',exact:true})).toBeVisible();await details.getByRole('button',{name:'Check out',exact:true}).click();
 await details.getByRole('button',{name:'Assign member',exact:true}).click();await details.getByLabel('Member to assign').selectOption('M002');await details.getByRole('button',{name:'Save member assignment'}).click();await expect(details.getByRole('button',{name:/Ananya Rao/})).toBeVisible();
 await details.getByRole('button',{name:'Deactivate trainer',exact:true}).click();await page.getByRole('dialog',{name:'Deactivate this trainer?'}).getByRole('button',{name:'Confirm',exact:true}).click();await expect(details.getByRole('alert')).toContainText('Reassign current members and upcoming classes');
 await details.getByRole('button',{name:'View class schedule'}).click();await expect(page.getByRole('heading',{name:'Studio timetable & rosters'})).toBeVisible();
});
