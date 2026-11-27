import {test, expect, type Page} from '@playwright/test';
async function navigate(page:Page,name:string){
 const opener=page.getByRole('button',{name:'Open navigation',exact:true});
 if(await opener.isVisible())await opener.click();
 await page.getByRole('navigation',{name:'Owner navigation'}).getByRole('button',{name,exact:true}).click();
}
test.beforeEach(async({page})=>{await page.clock.setFixedTime(new Date('2026-11-27T06:30:00Z'));});
test('new member can be assigned immediately and appears in the class roster',async({page})=>{
 await page.goto('/admin');await page.getByRole('button',{name:'Add member',exact:true}).click();
 const add=page.getByRole('dialog',{name:'Welcome someone new.'});
 await add.getByLabel('Full name').fill('Class Assignment Member');
 await add.getByLabel('Email address').fill('class.assignment@example.com');
 await add.getByRole('button',{name:'Add member',exact:true}).click();
 await page.getByRole('status').getByRole('button',{name:'Assign to class',exact:true}).click();
 const form=page.getByRole('dialog',{name:'Assign member to a class.'});
 await expect(form.getByLabel('Member',{exact:true})).toHaveValue('M041');
 const strength=await form.getByLabel('Class',{exact:true}).locator('option').filter({hasText:'Strength foundations'}).getAttribute('value');
 await form.getByLabel('Class',{exact:true}).selectOption(strength!);
 await form.getByRole('button',{name:'Confirm class assignment'}).click();
 await expect(form).toBeHidden();await expect(page.getByRole('status')).toContainText('Class Assignment Member assigned');
 await navigate(page,'Schedule');await page.getByRole('button',{name:/06:30 · Strength foundations/}).click();
 await expect(page.getByRole('dialog',{name:'Strength foundations',exact:true})).toContainText('Class Assignment Member');
 await page.keyboard.press('Escape');await navigate(page,'Members');
 await page.getByRole('textbox',{name:'Search members'}).fill('class.assignment@example.com');
 await page.getByRole('button',{name:/Class Assignment Member M041/}).click();
 await page.getByRole('dialog',{name:'Class Assignment Member',exact:true}).getByRole('button',{name:'Assign to class',exact:true}).click();
 await expect(form.getByLabel('Member',{exact:true})).toHaveValue('M041');
});
test('Schedule exposes assignment on phones, offers waitlists and prevents duplicates',async({page})=>{
 await page.setViewportSize({width:320,height:1000});await page.goto('/admin');await navigate(page,'Schedule');
 await page.getByRole('button',{name:'Assign to class',exact:true}).click();
 const form=page.getByRole('dialog',{name:'Assign member to a class.'});
 await form.getByLabel('Member',{exact:true}).selectOption('M040');
 const mobility=await form.getByLabel('Class',{exact:true}).locator('option').filter({hasText:'Mobility & reset'}).getAttribute('value');
 await form.getByLabel('Class',{exact:true}).selectOption(mobility!);
 await expect(form).toContainText('This assignment will join the waitlist.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await form.getByRole('button',{name:'Join class waitlist'}).click();
 await expect(page.getByRole('status')).toContainText('added to the waitlist');
 await page.getByRole('button',{name:'Assign to class',exact:true}).click();
 await form.getByLabel('Member',{exact:true}).selectOption('M040');await form.getByLabel('Class',{exact:true}).selectOption(mobility!);
 await form.getByRole('button',{name:'Join class waitlist'}).click();
 await expect(form.getByRole('alert')).toContainText('already booked or waitlisted');
});
test('member workout timings validate, save and remain editable',async({page})=>{
 await page.goto('/admin');await page.getByRole('button',{name:'Add member',exact:true}).click();
 const add=page.getByRole('dialog',{name:'Welcome someone new.'});
 await add.getByLabel('Full name').fill('Timed Member');await add.getByLabel('Email address').fill('timed@example.com');
 await add.getByLabel('Workout start time').fill('18:00');await add.getByLabel('Workout end time').fill('17:00');
 await add.getByRole('button',{name:'Add member',exact:true}).click();await expect(add.getByRole('alert')).toContainText('End time must be after start time');
 await add.getByLabel('Workout end time').fill('19:00');await add.getByRole('button',{name:'Add member',exact:true}).click();
 await navigate(page,'Members');await page.getByRole('textbox',{name:'Search members'}).fill('timed@example.com');await page.getByRole('button',{name:/Timed Member M041/}).click();
 const profile=page.getByRole('dialog',{name:'Timed Member',exact:true});await expect(profile).toContainText('18:00 – 19:00');
 await profile.getByRole('button',{name:'Edit member profile'}).click();await expect(profile.getByLabel('Workout start time')).toHaveValue('18:00');
 await profile.getByLabel('Workout end time').fill('19:30');await profile.getByRole('button',{name:'Save member profile'}).click();await expect(profile).toContainText('18:00 – 19:30');
});
