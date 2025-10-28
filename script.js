
        document.addEventListener('DOMContentLoaded', function() {
            const dnaInput = document.getElementById('dna-input');
            const simulateBtn = document.getElementById('simulate-btn');
            const startTranslationBtn = document.getElementById('start-translation');
            const resetBtn = document.getElementById('reset-btn');
            const dnaStrand = document.getElementById('dna-strand');
            const rnaStrand = document.getElementById('rna-strand');
            const aminoAcidChain = document.getElementById('amino-acid-chain');
            const ribosome = document.getElementById('ribosome');
            const rnaStrandAnimation = document.getElementById('rna-strand-animation');
            const progressBar = document.getElementById('simulation-progress');
            const processSteps = document.querySelectorAll('.process-step');
            
            // Bảng mã di truyền
            const geneticCode = {
                "UUU": "Phe", "UUC": "Phe",
                "UUA": "Leu", "UUG": "Leu", "CUU": "Leu", "CUC": "Leu", "CUA": "Leu", "CUG": "Leu",
                "AUU": "Ile", "AUC": "Ile", "AUA": "Ile",
                "AUG": "Met",
                "GUU": "Val", "GUC": "Val", "GUA": "Val", "GUG": "Val",
                "UCU": "Ser", "UCC": "Ser", "UCA": "Ser", "UCG": "Ser",
                "CCU": "Pro", "CCC": "Pro", "CCA": "Pro", "CCG": "Pro",
                "ACU": "Thr", "ACC": "Thr", "ACA": "Thr", "ACG": "Thr",
                "GCU": "Ala", "GCC": "Ala", "GCA": "Ala", "GCG": "Ala",
                "UAU": "Tyr", "UAC": "Tyr",
                "UAA": "STOP", "UAG": "STOP", "UGA": "STOP",
                "CAU": "His", "CAC": "His",
                "CAA": "Gln", "CAG": "Gln",
                "AAU": "Asn", "AAC": "Asn",
                "AAA": "Lys", "AAG": "Lys",
                "GAU": "Asp", "GAC": "Asp",
                "GAA": "Glu", "GAG": "Glu",
                "UGU": "Cys", "UGC": "Cys",
                "UGG": "Trp",
                "CGU": "Arg", "CGC": "Arg", "CGA": "Arg", "CGG": "Arg", "AGA": "Arg", "AGG": "Arg",
                "GGU": "Gly", "GGC": "Gly", "GGA": "Gly", "GGG": "Gly"
            };
            
            // Xử lý sự kiện nhấn nút mô phỏng
            simulateBtn.addEventListener('click', function() {
                const dnaSequence = dnaInput.value.toUpperCase().replace(/[^ATGC]/g, '');
                
                if (dnaSequence.length === 0) {
                    alert('Vui lòng nhập chuỗi ADN hợp lệ!');
                    return;
                }
                
                // Cập nhật thanh tiến trình
                progressBar.style.width = '33%';
                
                // Cập nhật trạng thái các bước
                updateProcessSteps(1);
                
                // Hiển thị chuỗi ADN
                displayDNAStrand(dnaSequence);
                
                // Thực hiện phiên mã
                const rnaSequence = transcribeDNAtoRNA(dnaSequence);
                
                // Hiển thị chuỗi mRNA
                displayRNAStrand(rnaSequence);
                
                // Cập nhật thanh tiến trình
                progressBar.style.width = '66%';
                
                // Cập nhật trạng thái các bước
                updateProcessSteps(2);
                
                // Chuẩn bị cho quá trình dịch mã
                prepareTranslation(rnaSequence);
            });
            
            // Xử lý sự kiện bắt đầu dịch mã
            startTranslationBtn.addEventListener('click', function() {
                const rnaSequence = rnaStrand.getAttribute('data-sequence');
                if (rnaSequence) {
                    startTranslation(rnaSequence);
                    
                    // Cập nhật thanh tiến trình
                    progressBar.style.width = '100%';
                    
                    // Cập nhật trạng thái các bước
                    updateProcessSteps(3);
                }
            });
            
            // Xử lý sự kiện làm lại
            resetBtn.addEventListener('click', function() {
                dnaInput.value = '';
                dnaStrand.innerHTML = '';
                rnaStrand.innerHTML = '';
                aminoAcidChain.innerHTML = '';
                ribosome.style.left = '0';
                startTranslationBtn.disabled = false;
                progressBar.style.width = '0%';
                
                // Đặt lại trạng thái các bước
                updateProcessSteps(0);
            });
            
            // Cập nhật trạng thái các bước trong quy trình
            function updateProcessSteps(activeStep) {
                processSteps.forEach((step, index) => {
                    if (index === activeStep) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            }
            
            // Hiển thị chuỗi ADN
            function displayDNAStrand(sequence) {
                dnaStrand.innerHTML = '';
                for (let i = 0; i < sequence.length; i++) {
                    const nucleotide = document.createElement('div');
                    nucleotide.className = `nucleotide dna-${sequence[i].toLowerCase()}`;
                    nucleotide.textContent = sequence[i];
                    nucleotide.setAttribute('data-index', i);
                    dnaStrand.appendChild(nucleotide);
                }
            }
            
            // Thực hiện phiên mã DNA → RNA
            function transcribeDNAtoRNA(dnaSequence) {
                const transcriptionMap = {
                    'A': 'U',
                    'T': 'A',
                    'G': 'C',
                    'C': 'G'
                };
                
                let rnaSequence = '';
                for (let i = 0; i < dnaSequence.length; i++) {
                    rnaSequence += transcriptionMap[dnaSequence[i]];
                }
                
                return rnaSequence;
            }
            
            // Hiển thị chuỗi mRNA
            function displayRNAStrand(sequence) {
                rnaStrand.innerHTML = '';
                rnaStrand.setAttribute('data-sequence', sequence);
                
                for (let i = 0; i < sequence.length; i++) {
                    const nucleotide = document.createElement('div');
                    nucleotide.className = `nucleotide rna-${sequence[i].toLowerCase()}`;
                    nucleotide.textContent = sequence[i];
                    nucleotide.setAttribute('data-index', i);
                    rnaStrand.appendChild(nucleotide);
                }
            }
            
            // Chuẩn bị cho quá trình dịch mã
            function prepareTranslation(rnaSequence) {
                aminoAcidChain.innerHTML = '';
                ribosome.style.left = '0';
                startTranslationBtn.disabled = false;
                
                // Cập nhật độ dài của sợi RNA trong hoạt ảnh
                const nucleotideWidth = 50; // px
                rnaStrandAnimation.style.background = `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent ${nucleotideWidth - 1}px,
                    var(--gray) ${nucleotideWidth - 1}px,
                    var(--gray) ${nucleotideWidth + 1}px
                )`;
            }
            
            // Bắt đầu quá trình dịch mã
            function startTranslation(rnaSequence) {
                startTranslationBtn.disabled = true;
                aminoAcidChain.innerHTML = '';
                
                const codons = [];
                for (let i = 0; i < rnaSequence.length; i += 3) {
                    if (i + 3 <= rnaSequence.length) {
                        codons.push(rnaSequence.substring(i, i + 3));
                    }
                }
                
                let currentCodonIndex = 0;
                const nucleotideWidth = 50; // px
                const ribosomeWidth = 70; // px
                const containerWidth = document.querySelector('.animation-container').offsetWidth;
                const maxLeft = containerWidth - ribosomeWidth;
                
                function translateNextCodon() {
                    if (currentCodonIndex >= codons.length) {
                        return;
                    }
                    
                    const codon = codons[currentCodonIndex];
                    const aminoAcid = geneticCode[codon] || '???';
                    
                    // Di chuyển ribosome đến vị trí codon hiện tại
                    const leftPosition = Math.min(currentCodonIndex * 3 * nucleotideWidth, maxLeft);
                    ribosome.style.left = `${leftPosition}px`;
                    
                    // Highlight codon trên chuỗi mRNA
                    highlightCodon(currentCodonIndex * 3, (currentCodonIndex * 3) + 3);
                    
                    // Thêm axit amin vào chuỗi (trừ khi là codon kết thúc)
                    if (aminoAcid !== 'STOP') {
                        setTimeout(() => {
                            const aaElement = document.createElement('div');
                            aaElement.className = 'amino-acid';
                            aaElement.textContent = aminoAcid;
                            aminoAcidChain.appendChild(aaElement);
                            
                            // Hiệu ứng highlight cho axit amin mới
                            aaElement.classList.add('highlight');
                            setTimeout(() => {
                                aaElement.classList.remove('highlight');
                            }, 1000);
                        }, 1000);
                    }
                    
                    currentCodonIndex++;
                    
                    // Tiếp tục với codon tiếp theo sau 1.5 giây
                    if (currentCodonIndex < codons.length && aminoAcid !== 'STOP') {
                        setTimeout(translateNextCodon, 1500);
                    }
                }
                
                // Bắt đầu quá trình dịch mã
                translateNextCodon();
            }
            
            // Highlight codon trên chuỗi mRNA
            function highlightCodon(start, end) {
                const nucleotides = rnaStrand.querySelectorAll('.nucleotide');
                
                // Bỏ highlight cũ
                nucleotides.forEach(nucleotide => {
                    nucleotide.classList.remove('highlight');
                });
                
                // Áp dụng highlight mới
                for (let i = start; i < end && i < nucleotides.length; i++) {
                    nucleotides[i].classList.add('highlight');
                }
            }
            
            // Thêm ví dụ mẫu
            dnaInput.value = "ATGCGTACGTAA";
        });