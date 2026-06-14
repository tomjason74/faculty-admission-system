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
        Schema::create('semester_signatories', function (Blueprint $table) {
            $table->id();
            $table->string('semester_code')->unique();
            $table->string('date')->nullable();
            $table->string('president_name')->nullable();
            $table->string('president_title')->default('President');
            $table->string('vpaa_name')->nullable();
            $table->string('vpaa_title')->default('Vice President for Academic Affairs');
            $table->string('sender_name')->nullable();
            $table->string('sender_title')->default('IODE Director');
            $table->string('recommender_name')->nullable();
            $table->string('recommender_title')->default('OUS Executive Director');
            $table->json('eval_semesters')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester_signatories');
    }
};
