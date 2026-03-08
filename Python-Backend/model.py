import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.layers import RandomFlip, RandomRotation, RandomZoom
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.utils.class_weight import compute_class_weight

TRAIN_DIR = r"C:\Users\91623\Desktop\final year project\Data fo Project\Data to detect diseases\Traning data"
VAL_DIR = r"C:\Users\91623\Desktop\final year project\Data fo Project\Data to detect diseases\Testing data"
IMG_SIZE = (224,224)
BATCH_SIZE = 32



train_datagen = ImageDataGenerator(rescale=1./255)

val_datagen = ImageDataGenerator(rescale=1./255)

print("Loading training dataset...")

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

print("Loading validation dataset...")

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

NUM_CLASSES = train_generator.num_classes
print("Detected classes:", NUM_CLASSES)

# ===============================
# 3 CLASS WEIGHTS (HANDLE IMBALANCE)
# ===============================

true_labels = train_generator.classes

class_weights_array = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(true_labels),
    y=true_labels
)

class_weights = dict(enumerate(class_weights_array))

print("Class weights calculated.")

# ===============================
# 4 DATA AUGMENTATION LAYER
# ===============================

data_augmentation = tf.keras.Sequential([
    RandomFlip("horizontal"),
    RandomRotation(0.1),
    RandomZoom(0.1)
])

# ===============================
# 5 LOAD MOBILENETV2 BASE MODEL
# ===============================

base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224,224,3)
)

base_model.trainable = False

# ===============================
# 6 BUILD MODEL
# ===============================

inputs = tf.keras.Input(shape=(224,224,3))

x = data_augmentation(inputs)

x = base_model(x, training=False)

x = GlobalAveragePooling2D()(x)

x = Dense(256, activation='relu')(x)

x = Dropout(0.5)(x)

outputs = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=['accuracy']
)

model.summary()

# ===============================
# 7 CALLBACKS
# ===============================

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    "best_crop_model.keras",
    monitor='val_accuracy',
    save_best_only=True
)

# ===============================
# 8 INITIAL TRAINING
# ===============================

print("Starting initial training...")

history = model.fit(
    train_generator,
    epochs=20,
    validation_data=val_generator,
    class_weight=class_weights,
    callbacks=[early_stop, checkpoint]
)

# ===============================
# 9 FINE TUNING (UNFREEZE TOP LAYERS)
# ===============================

print("Starting fine tuning...")

base_model.trainable = True

for layer in base_model.layers[:-40]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=['accuracy']
)

history_finetune = model.fit(
    train_generator,
    epochs=10,
    validation_data=val_generator,
    class_weight=class_weights,
    callbacks=[early_stop, checkpoint]
)

# ===============================
# 10 SAVE CLASS NAMES
# ===============================

class_names = list(train_generator.class_indices.keys())

with open("class_names.txt", "w") as f:
    for name in class_names:
        f.write(name + "\n")

print("Training complete.")
print("Model saved as best_crop_model.keras")
print("Class names saved in class_names.txt")