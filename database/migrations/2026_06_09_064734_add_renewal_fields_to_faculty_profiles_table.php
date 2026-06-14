<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('faculty_profiles', function (Blueprint $table) {
            $table->boolean('is_enrolled_graduate')->default(false);
            $table->string('grad_school_name')->nullable();
            $table->string('grad_program')->nullable();
            $table->boolean('is_new_hire')->default(false);
            $table->json('semester_evaluations')->nullable();
            $table->string('teaching_load_status')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'is_enrolled_graduate',
                'grad_school_name',
                'grad_program',
                'is_new_hire',
                'semester_evaluations',
                'teaching_load_status',
            ]);
        });
    }
};
