1. insert coures instruction from admin panel
    1. skill table
    1. subskill talbes
    1. question table

    report: 

```
SELECT students.student_id,students.name,student_skill_list.skill_id,skill.title 

from student_skill_list 
inner join skill on skill.id=student_skill_list.skill_id
INNER JOIN students on students.student_id=student_skill_list.stu_id

WHERE student_skill_list.stu_id="17303024"
```