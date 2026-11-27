import {test,expect,type Page} from '@playwright/test';
import {summarizeNutrition,nutritionPeriods,type NutritionProfile} from '../src/lib/admin-nutrition';
import {initialMembers} from '../src/lib/admin-demo';

test('nutrition averages exclude partial logs, private records, and unavailable targets',()=>{
 const members=[{...initialMembers[1],id:'shared'},{...initialMembers[2],id:'private'},{...initialMembers[3],id:'new'},{...initialMembers[0],id:'paused'}];
 const profiles:NutritionProfile[]=[{memberId:'shared',sharedWithGym:true,calorieTarget:2000,proteinTarget:100,days:[{date:'2026-11-21',meals:3,complete:true,calories:2400,protein:120},{date:'2026-11-22',meals:1,complete:false,calories:400,protein:20}]},{memberId:'private',sharedWithGym:false,calorieTarget:9999,proteinTarget:999,days:[{date:'2026-11-21',meals:3,complete:true,calories:9999,protein:999}]}];
 const summary=summarizeNutrition(members,profiles,nutritionPeriods[0],[]);
 expect(summary.active).toBe(3);expect(summary.shared).toBe(1);expect(summary.logging).toBe(1);
 expect(summary.averageCalories).toBe(2400);expect(summary.proteinPercent).toBe(120);expect(summary.completeDays).toBe(1);
 expect(summary.rows.find(row=>row.member.id==='private')).toMatchObject({shared:false,calories:null,protein:null,calorieTarget:null,proteinTarget:null});
 expect(summary.rows.find(row=>row.member.id==='new')).toMatchObject({shared:false,loggedDays:0});
 expect(summary.daily[0].logged).toBe(1);
 const previous=summarizeNutrition(members,profiles,nutritionPeriods[1],[]);expect(previous.averageCalories).toBeNull();expect(previous.proteinPercent).toBeNull();
 const noTargets=summarizeNutrition(members,[{...profiles[0],proteinTarget:null}],nutritionPeriods[0],[]);expect(noTargets.proteinPercent).toBeNull();expect(noTargets.averageCalories).toBe(2400);
 const reviewed=summarizeNutrition(members,profiles,nutritionPeriods[0],['current:shared']);expect(reviewed.pending).toBe(0);
});
async function navigate(page:Page,name:string){const open=page.getByRole('button',{name:'Open navigation',exact:true});if(await open.isVisible())await open.click();await page.getByRole('navigation',{name:'Owner navigation'}).getByRole('button',{name,exact:true}).click();}
test('nutrition snapshot opens filters, private rows stay undisclosed and days are inspectable',async({page})=>{
 await page.goto('/admin');await page.getByRole('button',{name:'Explore nutrition',exact:true}).click();
 await expect(page.getByRole('region',{name:'Meal logging activity'})).toBeVisible();
 const trend=page.getByRole('region',{name:'Weekly meal logging'});
 const first=trend.getByRole('button').first();await first.click();await expect(trend.locator('[aria-live]')).toContainText('21 Nov');
 await page.getByRole('combobox',{name:'Nutrition status'}).selectOption('Not shared');
 const table=page.getByRole('table');expect(await table.getByRole('row').count()).toBeGreaterThan(1);
 for(const row of await table.locator('tbody tr').all()){
  await expect(row.getByRole('cell').nth(2)).toHaveText('—');await expect(row.getByRole('cell').nth(3)).toHaveText('—');await expect(row.getByRole('button')).toHaveCount(0);
 }
 await page.getByRole('textbox',{name:'Search nutrition members'}).fill('unmatched member');await expect(page.getByText('No members match these filters.')).toBeVisible();
 await page.getByRole('textbox',{name:'Search nutrition members'}).fill('');
 await page.getByRole('combobox',{name:'Nutrition status'}).selectOption('All members');
 await page.getByRole('combobox',{name:'Nutrition coach'}).selectOption('Kabir Mehta');
 for(const row of await table.locator('tbody tr').all())await expect(row.getByRole('cell').first()).toContainText('Kabir Mehta');
 await page.getByRole('combobox',{name:'Nutrition coach'}).selectOption('All coaches');
 const firstName=await table.locator('tbody tr').first().getByRole('cell').first().textContent();
 await page.getByRole('button',{name:'Next nutrition members'}).click();expect(await table.locator('tbody tr').first().getByRole('cell').first().textContent()).not.toBe(firstName);
 await page.getByRole('button',{name:'Previous nutrition members'}).click();await expect(table.locator('tbody tr').first().getByRole('cell').first()).toHaveText(firstName!);
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('review acknowledgments remain scoped to the member and week and update the overview',async({page})=>{
 await page.goto('/admin');await page.getByRole('button',{name:'Explore nutrition'}).click();
 const pending=page.getByRole('region',{name:'Nutrition reviews pending'}).locator('strong');const before=Number(await pending.textContent());
 await page.getByRole('combobox',{name:'Nutrition status'}).selectOption('Needs review');
 await page.getByRole('button',{name:/^Mark .* reviewed$/}).first().click();await expect(pending).toHaveText(String(before-1));
 await expect(page.getByRole('status')).toContainText('No message was sent');
 await page.getByRole('combobox',{name:'Nutrition status'}).selectOption('Reviewed');await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
 await page.getByRole('combobox',{name:'Nutrition period'}).selectOption('previous');await expect(page.getByText('No members match these filters.')).toBeVisible();
 await page.getByRole('combobox',{name:'Nutrition period'}).selectOption('current');await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
 await navigate(page,'Overview');await expect(page.getByRole('region',{name:'Nutrition snapshot'})).toContainText(String(before-1));
 await navigate(page,'Nutrition');await page.getByRole('combobox',{name:'Nutrition status'}).selectOption('Reviewed');await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
});
