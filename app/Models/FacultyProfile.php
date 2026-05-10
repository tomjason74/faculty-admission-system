<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable(['user_id', 'department_id', 'degree', 'specialization', 'employment_type', 'status', 'hire_date'])]
class FacultyProfile extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $appends = ['is_compliant', 'compliance_percentage'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cv')->useDisk('local')->singleFile();
        $this->addMediaCollection('medical_certificates')->useDisk('local')->singleFile();
        $this->addMediaCollection('clearances')->useDisk('local')->singleFile();
        $this->addMediaCollection('ids')->useDisk('local')->singleFile();
        $this->addMediaCollection('class_records')->useDisk('local');
    }

    public function getIsCompliantAttribute(): bool
    {
        $requiredCollections = ['medical_certificates', 'clearances', 'ids'];
        foreach ($requiredCollections as $collection) {
            if ($this->getMedia($collection)->count() === 0) {
                return false;
            }
        }
        return true;
    }

    public function getCompliancePercentageAttribute(): int
    {
        $requiredCollections = ['medical_certificates', 'clearances', 'ids'];
        $filled = 0;
        foreach ($requiredCollections as $collection) {
            if ($this->getMedia($collection)->count() > 0) {
                $filled++;
            }
        }
        return count($requiredCollections) > 0 ? (int)(($filled / count($requiredCollections)) * 100) : 100;
    }
}
