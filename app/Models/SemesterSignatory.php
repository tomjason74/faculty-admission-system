<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'semester_code',
    'date',
    'president_name',
    'president_title',
    'vpaa_name',
    'vpaa_title',
    'sender_name',
    'sender_title',
    'recommender_name',
    'recommender_title',
    'eval_semesters'
])]
class SemesterSignatory extends Model
{
    protected function casts(): array
    {
        return [
            'eval_semesters' => 'array',
        ];
    }
}
