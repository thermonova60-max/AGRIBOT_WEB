/**
 * Agri-Bot - Education JavaScript
 * Course display, quiz functionality, and progress tracking
 */

class Education {
  constructor() {
    this.courses = [];
    this.progress = {};
    this.currentQuiz = null;
    
    this.coursesGrid = document.getElementById('coursesGrid');
    this.quizModal = document.getElementById('quizModal');
    
    this.init();
  }
  
  async init() {
    await this.loadCourses();
    this.loadProgress();
    this.renderCourses();
    this.bindEvents();
  }
  
  async loadCourses() {
    try {
      const response = await fetch('data/courses.json');
      if (response.ok) {
        this.courses = await response.json();
      }
    } catch (e) {
      console.log('Using default courses data');
      this.courses = this.getDefaultCourses();
    }
  }
  
  getDefaultCourses() {
    return [
      {
        id: 1,
        title: 'Introduction to Organic Farming',
        description: 'Learn the fundamentals of organic agriculture and sustainable practices.',
        level: 'Beginner',
        duration: '2 hours',
        lessons: 8,
        image: 'assets/images/course-organic.jpg',
        quiz: {
          title: 'Organic Farming Quiz',
          questions: [
            {
              question: 'What is the main principle of organic farming?',
              options: ['Use of chemical fertilizers', 'Working with natural systems', 'Maximizing yield at any cost', 'Using GMO seeds'],
              correct: 1
            },
            {
              question: 'Which of these is an organic fertilizer?',
              options: ['Urea', 'DAP', 'Vermicompost', 'NPK 10-26-26'],
              correct: 2
            },
            {
              question: 'What is crop rotation?',
              options: ['Rotating crops in different fields', 'Growing same crop every year', 'Growing different crops in sequence', 'Rotating irrigation system'],
              correct: 2
            }
          ]
        }
      },
      {
        id: 2,
        title: 'Water Management & Irrigation',
        description: 'Master efficient irrigation techniques and water conservation methods.',
        level: 'Intermediate',
        duration: '3 hours',
        lessons: 12,
        image: 'assets/images/course-water.jpg',
        quiz: {
          title: 'Irrigation Quiz',
          questions: [
            {
              question: 'Which irrigation method has the highest efficiency?',
              options: ['Flood irrigation', 'Sprinkler', 'Drip irrigation', 'Furrow irrigation'],
              correct: 2
            },
            {
              question: 'Best time to irrigate crops is:',
              options: ['Afternoon', 'Early morning', 'Midnight', 'Noon'],
              correct: 1
            },
            {
              question: 'Mulching helps in:',
              options: ['Increasing evaporation', 'Reducing moisture loss', 'Increasing weeds', 'None of the above'],
              correct: 1
            }
          ]
        }
      },
      {
        id: 3,
        title: 'Pest & Disease Management',
        description: 'Identify common pests and learn integrated pest management strategies.',
        level: 'Intermediate',
        duration: '4 hours',
        lessons: 15,
        image: 'assets/images/course-pest.jpg',
        quiz: {
          title: 'Pest Management Quiz',
          questions: [
            {
              question: 'IPM stands for:',
              options: ['Intensive Pest Management', 'Integrated Pest Management', 'Internal Pest Monitor', 'Insect Prevention Method'],
              correct: 1
            },
            {
              question: 'Neem oil is used as:',
              options: ['Fertilizer', 'Natural pesticide', 'Growth hormone', 'Irrigation additive'],
              correct: 1
            },
            {
              question: 'Biological pest control uses:',
              options: ['Chemicals', 'Natural predators', 'Fire', 'Flooding'],
              correct: 1
            }
          ]
        }
      },
      {
        id: 4,
        title: 'Soil Health & Fertility',
        description: 'Understand soil composition and learn to maintain optimal soil health.',
        level: 'Beginner',
        duration: '2.5 hours',
        lessons: 10,
        image: 'assets/images/course-soil.jpg',
        quiz: {
          title: 'Soil Health Quiz',
          questions: [
            {
              question: 'What pH is considered neutral for soil?',
              options: ['5', '7', '9', '11'],
              correct: 1
            },
            {
              question: 'NPK stands for:',
              options: ['Nitrogen, Potash, Calcium', 'Nitrogen, Phosphorus, Potassium', 'Natural Plant Nutrients', 'None of these'],
              correct: 1
            },
            {
              question: 'Soil testing should be done:',
              options: ['Never', 'Once in lifetime', 'Every 2-3 years', 'Every month'],
              correct: 2
            }
          ]
        }
      },
      {
        id: 5,
        title: 'Modern Farming Technologies',
        description: 'Explore precision agriculture, drones, and smart farming solutions.',
        level: 'Advanced',
        duration: '5 hours',
        lessons: 18,
        image: 'assets/images/course-tech.jpg',
        quiz: {
          title: 'AgriTech Quiz',
          questions: [
            {
              question: 'Precision agriculture uses:',
              options: ['Traditional methods only', 'GPS and sensors', 'Manual labor only', 'No technology'],
              correct: 1
            },
            {
              question: 'Drones in agriculture are used for:',
              options: ['Entertainment', 'Crop monitoring and spraying', 'Transportation', 'None'],
              correct: 1
            },
            {
              question: 'IoT in farming helps with:',
              options: ['Social media', 'Real-time monitoring', 'Email', 'Gaming'],
              correct: 1
            }
          ]
        }
      },
      {
        id: 6,
        title: 'Post-Harvest Management',
        description: 'Learn proper storage, processing, and value addition techniques.',
        level: 'Intermediate',
        duration: '3 hours',
        lessons: 11,
        image: 'assets/images/course-harvest.jpg',
        quiz: {
          title: 'Post-Harvest Quiz',
          questions: [
            {
              question: 'Proper grain storage requires:',
              options: ['High moisture', 'Low moisture and pest control', 'Open containers', 'Direct sunlight'],
              correct: 1
            },
            {
              question: 'Value addition means:',
              options: ['Selling raw produce', 'Processing to increase value', 'Throwing away excess', 'None'],
              correct: 1
            },
            {
              question: 'Cold storage is used for:',
              options: ['Grains', 'Perishable produce', 'Seeds', 'Fertilizers'],
              correct: 1
            }
          ]
        }
      }
    ];
  }
  
  loadProgress() {
    const saved = localStorage.getItem('agribot_progress');
    if (saved) {
      try {
        this.progress = JSON.parse(saved);
      } catch (e) {
        this.progress = {};
      }
    }
  }
  
  saveProgress() {
    localStorage.setItem('agribot_progress', JSON.stringify(this.progress));
  }
  
  bindEvents() {
    // Close modal
    const closeBtn = this.quizModal?.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeQuiz());
    }
    
    // Close modal on outside click
    if (this.quizModal) {
      this.quizModal.addEventListener('click', (e) => {
        if (e.target === this.quizModal) {
          this.closeQuiz();
        }
      });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuiz();
      }
    });
  }
  
  renderCourses() {
    if (!this.coursesGrid) return;
    
    this.coursesGrid.innerHTML = this.courses.map(course => {
      const courseProgress = this.progress[course.id] || { completed: false, score: 0 };
      const progressPercent = courseProgress.completed ? 100 : (courseProgress.lessonsCompleted || 0) / course.lessons * 100;
      
      return `
        <div class="course-card" data-id="${course.id}">
          <div class="course-card__image-wrapper">
            <img src="${course.image}" alt="${course.title}" class="course-card__image"
                 onerror="this.style.display='none'">
          </div>
          <div class="course-card__content">
            <span class="course-card__level">${course.level}</span>
            <h3 class="course-card__title">${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-card__meta">
              <span>📚 ${course.lessons} Lessons</span>
              <span>⏱️ ${course.duration}</span>
            </div>
            <div class="course-card__progress">
              <div class="progress-bar">
                <div class="progress-bar__fill" style="width: ${progressPercent}%"></div>
              </div>
            </div>
            <div class="course-card__actions">
              <button class="btn btn-primary" onclick="education.startCourse(${course.id})">
                ${courseProgress.completed ? 'Review' : 'Start Learning'}
              </button>
              ${course.quiz ? `
                <button class="btn btn-outline" onclick="education.openQuiz(${course.id})">
                  Take Quiz
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  startCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Initialize progress if not exists
    if (!this.progress[courseId]) {
      this.progress[courseId] = {
        started: true,
        lessonsCompleted: 0,
        completed: false,
        score: 0
      };
      this.saveProgress();
    }
    
    // For demo, show alert
    alert(`Starting course: ${course.title}\n\nThis is a demo. In the full version, you would see:\n- Video lessons\n- Interactive content\n- Progress tracking\n- Downloadable resources`);
    
    // Simulate progress
    this.progress[courseId].lessonsCompleted = Math.min(
      (this.progress[courseId].lessonsCompleted || 0) + 1,
      course.lessons
    );
    this.saveProgress();
    this.renderCourses();
  }
  
  openQuiz(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course || !course.quiz) return;
    
    this.currentQuiz = {
      courseId,
      quiz: course.quiz,
      currentQuestion: 0,
      score: 0,
      answers: []
    };
    
    this.renderQuizQuestion();
    this.quizModal.classList.add('active');
  }
  
  renderQuizQuestion() {
    const { quiz, currentQuestion, score } = this.currentQuiz;
    const question = quiz.questions[currentQuestion];
    const modalContent = this.quizModal.querySelector('.modal__content');
    
    modalContent.innerHTML = `
      <div class="modal__header">
        <h3>${quiz.title}</h3>
        <button class="modal__close">&times;</button>
      </div>
      <div class="quiz-progress">
        Question ${currentQuestion + 1} of ${quiz.questions.length}
      </div>
      <div class="quiz-question">
        <h4>${question.question}</h4>
        <div class="quiz-options">
          ${question.options.map((option, index) => `
            <button class="quiz-option" data-index="${index}" onclick="education.selectAnswer(${index})">
              ${option}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    // Re-bind close button
    modalContent.querySelector('.modal__close').addEventListener('click', () => this.closeQuiz());
  }
  
  selectAnswer(answerIndex) {
    const { quiz, currentQuestion } = this.currentQuiz;
    const question = quiz.questions[currentQuestion];
    const options = this.quizModal.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(opt => opt.disabled = true);
    
    // Show correct/incorrect
    options[answerIndex].classList.add(answerIndex === question.correct ? 'correct' : 'incorrect');
    options[question.correct].classList.add('correct');
    
    // Update score
    if (answerIndex === question.correct) {
      this.currentQuiz.score++;
    }
    this.currentQuiz.answers.push(answerIndex);
    
    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestion + 1 < quiz.questions.length) {
        this.currentQuiz.currentQuestion++;
        this.renderQuizQuestion();
      } else {
        this.showQuizResults();
      }
    }, 1500);
  }
  
  showQuizResults() {
    const { courseId, quiz, score } = this.currentQuiz;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;
    
    const modalContent = this.quizModal.querySelector('.modal__content');
    
    modalContent.innerHTML = `
      <div class="modal__header">
        <h3>Quiz Results</h3>
        <button class="modal__close">&times;</button>
      </div>
      <div class="quiz-results">
        <div class="quiz-results__score ${passed ? 'passed' : 'failed'}">
          <div class="quiz-results__percentage">${percentage}%</div>
          <div class="quiz-results__text">
            ${passed ? '🎉 Congratulations! You passed!' : '📚 Keep learning and try again!'}
          </div>
        </div>
        <div class="quiz-results__details">
          <p>You got ${score} out of ${totalQuestions} questions correct.</p>
          ${passed ? `
            <p>You've earned a certificate for this course!</p>
            <button class="btn btn-secondary" onclick="education.downloadCertificate(${courseId})">
              Download Certificate
            </button>
          ` : `
            <p>You need 70% or higher to pass. Review the course material and try again.</p>
          `}
        </div>
        <div class="quiz-results__actions">
          <button class="btn btn-primary" onclick="education.closeQuiz()">Close</button>
          ${!passed ? `
            <button class="btn btn-outline" onclick="education.openQuiz(${courseId})">Retry Quiz</button>
          ` : ''}
        </div>
      </div>
    `;
    
    // Update progress
    if (passed) {
      this.progress[courseId] = {
        ...this.progress[courseId],
        completed: true,
        score: percentage
      };
      this.saveProgress();
      this.renderCourses();
    }
    
    // Re-bind close button
    modalContent.querySelector('.modal__close').addEventListener('click', () => this.closeQuiz());
  }
  
  downloadCertificate(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    
    const progress = this.progress[courseId];
    
    // Create a simple certificate (in a real app, this would be a proper PDF)
    const certificateContent = `
      ========================================
              CERTIFICATE OF COMPLETION
      ========================================
      
      This is to certify that
      
      [Your Name]
      
      has successfully completed the course
      
      "${course.title}"
      
      with a score of ${progress.score}%
      
      Date: ${new Date().toLocaleDateString()}
      
      Agri-Bot Educational Platform
      ========================================
    `;
    
    // Download as text file
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${course.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Certificate downloaded! In the full version, this would be a professional PDF certificate.');
  }
  
  closeQuiz() {
    this.quizModal.classList.remove('active');
    this.currentQuiz = null;
  }
}

// Initialize education module when DOM is ready
let education;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('coursesGrid')) {
    education = new Education();
  }
});
