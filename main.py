from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QFileDialog, QPushButton
from PyQt5.QtWebEngineWidgets import QWebEngineView, QWebEngineProfile
from PyQt5.QtCore import QUrl
import sys

class App(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Florece Sanando App")
        self.setGeometry(100, 100, 800, 600)
        
        # Crear un widget central
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Crear un layout
        layout = QVBoxLayout()
        
        # Crear un QWebEngineView y cargar el archivo HTML
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("file:///d:/FloreceSanandoApp EXE/index.html"))
        layout.addWidget(self.browser)
        
        # Botón para descargar sesión en PDF
        self.download_button = QPushButton("Descargar Sesión en PDF")
        self.download_button.clicked.connect(self.download_pdf)
        layout.addWidget(self.download_button)
        
        # Establecer el layout en el widget central
        central_widget.setLayout(layout)
        
        # Conectar el gestor de descargas
        profile = QWebEngineProfile.defaultProfile()
        profile.downloadRequested.connect(self.on_downloadRequested)

    def on_downloadRequested(self, download):
        # Abrir un diálogo para seleccionar la ubicación de guardado
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getSaveFileName(self, "Guardar archivo", download.path(), "All Files (*);;PDF Files (*.pdf)", options=options)
        if file_path:
            download.setPath(file_path)
            download.accept()

    def download_pdf(self):
        # Simular la descarga de un PDF de la sesión
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getSaveFileName(self, "Guardar Sesión en PDF", "", "PDF Files (*.pdf)", options=options)
        if file_path:
            # Aquí puedes agregar la lógica para generar y guardar el PDF
            print(f"PDF guardado en: {file_path}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = App()
    window.show()
    sys.exit(app.exec_())
