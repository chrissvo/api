CREATE TABLE IF NOT EXISTS responses (
  response_id       	  serial primary key,
  group_name			      text not null,
  name           		    text not null,
  attends_ceremony 		  boolean not null default false,
  attends_diner			    boolean not null default false,
  attends_party			    boolean not null default false,
  attends_breakfast		  boolean not null default false,
  needs_bike			      boolean not null default false,
  sleeps_over			      text not null default 'camping',
  allergies				      boolean not null default false,
  allergies_description text,
  questions_or_remarks  text
);
